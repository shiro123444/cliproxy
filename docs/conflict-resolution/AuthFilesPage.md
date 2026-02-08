# AuthFilesPage.tsx 冲突解决

这是最容易冲突的文件，因为上游经常修改它。

## 我们的修改点

### 1. Import 语句（约第 23-25 行）

```typescript
import { ANTIGRAVITY_CONFIG, CODEX_CONFIG, GEMINI_CLI_CONFIG } from '@/components/quota';
// Fork 增强: Kiro 和 Copilot 配额支持
import { KIRO_CONFIG, COPILOT_CONFIG } from '@/components/quota';
```

### 2. QuotaProviderType 类型（约第 103-105 行）

```typescript
// Fork 增强: 添加 kiro 和 github-copilot 到 QuotaProviderType
type QuotaProviderType = 'antigravity' | 'codex' | 'gemini-cli' | 'kiro' | 'github-copilot';

// Fork 增强: 添加 kiro 和 github-copilot 到 QUOTA_PROVIDER_TYPES
const QUOTA_PROVIDER_TYPES = new Set<QuotaProviderType>(['antigravity', 'codex', 'gemini-cli', 'kiro', 'github-copilot']);
```

### 3. useQuotaStore hooks（在 geminiCliQuota 后面）

```typescript
const geminiCliQuota = useQuotaStore((state) => state.geminiCliQuota);
// Fork 增强: Kiro 和 Copilot 配额
const kiroQuota = useQuotaStore((state) => state.kiroQuota);
const copilotQuota = useQuotaStore((state) => state.copilotQuota);
```

```typescript
const setGeminiCliQuota = useQuotaStore((state) => state.setGeminiCliQuota);
// Fork 增强: Kiro 和 Copilot 配额
const setKiroQuota = useQuotaStore((state) => state.setKiroQuota);
const setCopilotQuota = useQuotaStore((state) => state.setCopilotQuota);
```

### 4. getQuotaConfig 函数

```typescript
const getQuotaConfig = (type: QuotaProviderType) => {
  if (type === 'antigravity') return ANTIGRAVITY_CONFIG;
  if (type === 'codex') return CODEX_CONFIG;
  // Fork 增强: Kiro 和 Copilot 配额
  if (type === 'kiro') return KIRO_CONFIG;
  if (type === 'github-copilot') return COPILOT_CONFIG;
  return GEMINI_CLI_CONFIG;
};
```

### 5. getQuotaState 函数

**注意**：上游可能改成 useCallback，需要合并：

```typescript
const getQuotaState = useCallback(
  (type: QuotaProviderType, fileName: string) => {
    if (type === 'antigravity') return antigravityQuota[fileName];
    if (type === 'codex') return codexQuota[fileName];
    // Fork 增强: Kiro 和 Copilot 配额
    if (type === 'kiro') return kiroQuota[fileName];
    if (type === 'github-copilot') return copilotQuota[fileName];
    return geminiCliQuota[fileName];
  },
  [antigravityQuota, codexQuota, geminiCliQuota, kiroQuota, copilotQuota]
);
```

### 6. updateQuotaState 函数

在 codex 分支后添加：

```typescript
// Fork 增强: Kiro 和 Copilot 配额
if (type === 'kiro') {
  setKiroQuota(updater as never);
  return;
}
if (type === 'github-copilot') {
  setCopilotQuota(updater as never);
  return;
}
```

依赖数组添加：`setKiroQuota, setCopilotQuota`

## 冲突解决原则

1. **接受上游的结构变化**（如 useCallback 包装）
2. **在适当位置插入我们的 kiro/copilot 分支**
3. **更新依赖数组**（如果有）
