# useQuotaStore.ts 冲突解决

## 我们的修改点

### 1. Import 类型

```typescript
import type { AntigravityQuotaState, CodexQuotaState, GeminiCliQuotaState } from '@/types';
// Fork 增强: Kiro 和 Copilot 配额支持
import type { KiroQuotaState, CopilotQuotaState } from '@/types';
```

### 2. QuotaStoreState 接口

在 `geminiCliQuota` 后添加：

```typescript
geminiCliQuota: Record<string, GeminiCliQuotaState>;
// Fork 增强: Kiro 和 Copilot 配额
kiroQuota: Record<string, KiroQuotaState>;
copilotQuota: Record<string, CopilotQuotaState>;
```

在 `setGeminiCliQuota` 后添加：

```typescript
setGeminiCliQuota: (updater: QuotaUpdater<Record<string, GeminiCliQuotaState>>) => void;
// Fork 增强: Kiro 和 Copilot 配额
setKiroQuota: (updater: QuotaUpdater<Record<string, KiroQuotaState>>) => void;
setCopilotQuota: (updater: QuotaUpdater<Record<string, CopilotQuotaState>>) => void;
```

### 3. Store 实现

初始状态：

```typescript
geminiCliQuota: {},
// Fork 增强: Kiro 和 Copilot 配额
kiroQuota: {},
copilotQuota: {},
```

Setter 函数：

```typescript
setGeminiCliQuota: (updater) =>
  set((state) => ({
    geminiCliQuota: resolveUpdater(updater, state.geminiCliQuota)
  })),
// Fork 增强: Kiro 和 Copilot 配额
setKiroQuota: (updater) =>
  set((state) => ({
    kiroQuota: resolveUpdater(updater, state.kiroQuota)
  })),
setCopilotQuota: (updater) =>
  set((state) => ({
    copilotQuota: resolveUpdater(updater, state.copilotQuota)
  })),
```

clearQuotaCache：

```typescript
clearQuotaCache: () =>
  set({
    antigravityQuota: {},
    codexQuota: {},
    geminiCliQuota: {},
    // Fork 增强: Kiro 和 Copilot 配额
    kiroQuota: {},
    copilotQuota: {}
  })
```
