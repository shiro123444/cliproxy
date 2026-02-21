import { DEFAULT_API_PORT, MANAGEMENT_API_PREFIX } from './constants';

const DEFAULT_TUNNEL_API_BASE = 'https://openai.wbuai.me';

const parseTunnelHosts = (value: string | undefined): string[] => {
  return (value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

const resolveTunnelApiBaseFromEnv = (): string => {
  const configured = (import.meta.env.VITE_TUNNEL_API_BASE || '').trim();
  return configured || DEFAULT_TUNNEL_API_BASE;
};

const shouldUseTunnelApiBase = (hostname: string): boolean => {
  const host = (hostname || '').toLowerCase();
  if (!host) return false;

  const tunnelHosts = parseTunnelHosts(import.meta.env.VITE_TUNNEL_HOSTS);
  if (tunnelHosts.length === 0) {
    return host === 'openai.wbuai.me';
  }

  return tunnelHosts.includes(host);
};

export const normalizeApiBase = (input: string): string => {
  let base = (input || '').trim();
  if (!base) return '';
  // Accept users pasting API endpoints and normalize back to server root.
  base = base.replace(/\/?v1\/?$/i, '');
  base = base.replace(/\/?v0\/management\/?$/i, '');
  base = base.replace(/\/+$/i, '');
  if (!/^https?:\/\//i.test(base)) {
    base = `http://${base}`;
  }
  return base;
};

export const computeApiUrl = (base: string): string => {
  const normalized = normalizeApiBase(base);
  if (!normalized) return '';
  return `${normalized}${MANAGEMENT_API_PREFIX}`;
};

export const detectApiBaseFromLocation = (): string => {
  try {
    const { protocol, hostname, port } = window.location;

    // For public tunnel domains, force the configured tunnel API base.
    if (shouldUseTunnelApiBase(hostname)) {
      return normalizeApiBase(resolveTunnelApiBaseFromEnv());
    }

    const normalizedPort = port ? `:${port}` : '';
    return normalizeApiBase(`${protocol}//${hostname}${normalizedPort}`);
  } catch (error) {
    console.warn('Failed to detect api base from location, fallback to default', error);
    return normalizeApiBase(`http://localhost:${DEFAULT_API_PORT}`);
  }
};

export const isLocalhost = (hostname: string): boolean => {
  const value = (hostname || '').toLowerCase();
  return value === 'localhost' || value === '127.0.0.1' || value === '[::1]';
};
