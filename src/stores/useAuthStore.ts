/**
 * 认证状态管理
 * 从原项目 src/modules/login.js 和 src/core/connection.js 迁移
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, LoginCredentials, GuestCredentials, ConnectionStatus } from '@/types';
import { STORAGE_KEY_AUTH } from '@/utils/constants';
import { secureStorage } from '@/services/storage/secureStorage';
import { apiClient } from '@/services/api/client';
import { useConfigStore } from './useConfigStore';
import { detectApiBaseFromLocation, normalizeApiBase } from '@/utils/connection';

const GUEST_USERNAME = 'wbuai';
const GUEST_PASSWORD = 'wbuai';
const GUEST_MANAGEMENT_KEY =
  import.meta.env.VITE_GUEST_MANAGEMENT_KEY?.trim() || GUEST_PASSWORD;

interface AuthStoreState extends AuthState {
  connectionStatus: ConnectionStatus;
  connectionError: string | null;

  // 操作
  login: (credentials: LoginCredentials) => Promise<void>;
  loginGuest: (credentials: GuestCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  restoreSession: () => Promise<boolean>;
  updateServerVersion: (version: string | null, buildDate?: string | null) => void;
  updateConnectionStatus: (status: ConnectionStatus, error?: string | null) => void;
}

let restoreSessionPromise: Promise<boolean> | null = null;

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      apiBase: '',
      managementKey: '',
      rememberPassword: false,
      accessMode: 'full',
      serverVersion: null,
      serverBuildDate: null,
      connectionStatus: 'disconnected',
      connectionError: null,

      // 恢复会话并自动登录
      restoreSession: () => {
        if (restoreSessionPromise) return restoreSessionPromise;

        restoreSessionPromise = (async () => {
          secureStorage.migratePlaintextKeys(['apiBase', 'apiUrl', 'managementKey']);

          const wasLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
          const legacyBase =
            secureStorage.getItem<string>('apiBase') ||
            secureStorage.getItem<string>('apiUrl', { encrypt: true });
          const legacyKey = secureStorage.getItem<string>('managementKey');

          const { apiBase, managementKey, rememberPassword, accessMode } = get();
          const resolvedBase = normalizeApiBase(apiBase || legacyBase || detectApiBaseFromLocation());
          const resolvedKey = managementKey || legacyKey || '';
          const resolvedAccessMode = accessMode === 'guest' ? 'guest' : 'full';
          const resolvedRememberPassword =
            resolvedAccessMode === 'guest'
              ? false
              : rememberPassword || Boolean(managementKey) || Boolean(legacyKey);

          set({
            apiBase: resolvedBase,
            managementKey: resolvedKey,
            accessMode: resolvedAccessMode,
            rememberPassword: resolvedRememberPassword
          });
          apiClient.setConfig({ apiBase: resolvedBase, managementKey: resolvedKey });
          apiClient.setReadOnly(resolvedAccessMode === 'guest');

          if (wasLoggedIn && resolvedAccessMode === 'guest' && resolvedBase) {
            try {
              await get().loginGuest({
                apiBase: resolvedBase,
                username: GUEST_USERNAME,
                password: GUEST_PASSWORD
              });
              return true;
            } catch (error) {
              console.warn('Auto guest login failed:', error);
              return false;
            }
          }

          if (wasLoggedIn && resolvedBase && resolvedKey) {
            try {
              await get().login({
                apiBase: resolvedBase,
                managementKey: resolvedKey,
                rememberPassword: resolvedRememberPassword
              });
              return true;
            } catch (error) {
              console.warn('Auto login failed:', error);
              return false;
            }
          }

          return false;
        })();

        return restoreSessionPromise;
      },

      loginGuest: async (credentials) => {
        const apiBase = normalizeApiBase(credentials.apiBase || detectApiBaseFromLocation());
        const username = credentials.username.trim().toLowerCase();
        const password = credentials.password.trim();

        if (username !== GUEST_USERNAME || password !== GUEST_PASSWORD) {
          throw new Error('Guest username or password is invalid');
        }

        set({ connectionStatus: 'connecting', connectionError: null });

        apiClient.setConfig({
          apiBase,
          managementKey: GUEST_MANAGEMENT_KEY
        });
        apiClient.setReadOnly(true);

        try {
          await useConfigStore.getState().fetchConfig(undefined, true);
          set({
            connectionStatus: 'connected',
            connectionError: null
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : null;

          set({
            connectionStatus: 'disconnected',
            connectionError: message
          });
        }

        set({
          isAuthenticated: true,
          apiBase,
          managementKey: GUEST_MANAGEMENT_KEY,
          rememberPassword: false,
          accessMode: 'guest'
        });
        localStorage.setItem('isLoggedIn', 'true');
      },

      // 登录
      login: async (credentials) => {
        const apiBase = normalizeApiBase(credentials.apiBase);
        const managementKey = credentials.managementKey.trim();
        const rememberPassword = credentials.rememberPassword ?? get().rememberPassword ?? false;

        try {
          set({ connectionStatus: 'connecting' });

          // 配置 API 客户端
          apiClient.setConfig({
            apiBase,
            managementKey
          });
          apiClient.setReadOnly(false);

          // 测试连接 - 获取配置
          await useConfigStore.getState().fetchConfig(undefined, true);

          // 登录成功
          set({
            isAuthenticated: true,
            apiBase,
            managementKey,
            rememberPassword,
            accessMode: 'full',
            connectionStatus: 'connected',
            connectionError: null
          });
          if (rememberPassword) {
            localStorage.setItem('isLoggedIn', 'true');
          } else {
            localStorage.removeItem('isLoggedIn');
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : 'Connection failed';
          set({
            connectionStatus: 'error',
            connectionError: message || 'Connection failed'
          });
          throw error;
        }
      },

      // 登出
      logout: () => {
        restoreSessionPromise = null;
        useConfigStore.getState().clearCache();
        set({
          isAuthenticated: false,
          apiBase: '',
          managementKey: '',
          rememberPassword: false,
          accessMode: 'full',
          serverVersion: null,
          serverBuildDate: null,
          connectionStatus: 'disconnected',
          connectionError: null
        });
        apiClient.setReadOnly(false);
        localStorage.removeItem('isLoggedIn');
      },

      // 检查认证状态
      checkAuth: async () => {
        const { managementKey, apiBase, accessMode } = get();

        if (accessMode === 'guest') {
          if (!apiBase) {
            return false;
          }

          try {
            apiClient.setConfig({
              apiBase,
              managementKey: managementKey || GUEST_MANAGEMENT_KEY
            });
            apiClient.setReadOnly(true);

            await useConfigStore.getState().fetchConfig();

            set({
              isAuthenticated: true,
              connectionStatus: 'connected',
              connectionError: null
            });
            return true;
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : typeof error === 'string'
                  ? error
                  : null;

            set({
              isAuthenticated: true,
              connectionStatus: 'disconnected',
              connectionError: message
            });
            return true;
          }
        }

        if (!managementKey || !apiBase) {
          return false;
        }

        try {
          // 重新配置客户端
          apiClient.setConfig({ apiBase, managementKey });
          apiClient.setReadOnly(false);

          // 验证连接
          await useConfigStore.getState().fetchConfig();

          set({
            isAuthenticated: true,
            connectionStatus: 'connected'
          });

          return true;
        } catch {
          set({
            isAuthenticated: false,
            connectionStatus: 'error'
          });
          return false;
        }
      },

      // 更新服务器版本
      updateServerVersion: (version, buildDate) => {
        set({ serverVersion: version || null, serverBuildDate: buildDate || null });
      },

      // 更新连接状态
      updateConnectionStatus: (status, error = null) => {
        set({
          connectionStatus: status,
          connectionError: error
        });
      }
    }),
    {
      name: STORAGE_KEY_AUTH,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const data = secureStorage.getItem<AuthStoreState>(name);
          return data ? JSON.stringify(data) : null;
        },
        setItem: (name, value) => {
          secureStorage.setItem(name, JSON.parse(value));
        },
        removeItem: (name) => {
          secureStorage.removeItem(name);
        }
      })),
      partialize: (state) => ({
        apiBase: state.apiBase,
        ...(state.rememberPassword || state.accessMode === 'guest'
          ? { managementKey: state.managementKey }
          : {}),
        rememberPassword: state.rememberPassword,
        accessMode: state.accessMode,
        serverVersion: state.serverVersion,
        serverBuildDate: state.serverBuildDate
      })
    }
  )
);

// 监听全局未授权事件
if (typeof window !== 'undefined') {
  window.addEventListener('unauthorized', () => {
    const authState = useAuthStore.getState();
    if (authState.accessMode === 'guest') {
      return;
    }
    authState.logout();
  });

  window.addEventListener(
    'server-version-update',
    ((e: CustomEvent) => {
      const detail = e.detail || {};
      useAuthStore.getState().updateServerVersion(detail.version || null, detail.buildDate || null);
    }) as EventListener
  );
}
