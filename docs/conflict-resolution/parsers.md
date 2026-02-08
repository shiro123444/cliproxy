# parsers.ts 冲突解决

## 我们的修改点

### 1. Import 类型

```typescript
import type { CodexUsagePayload, GeminiCliQuotaPayload } from '@/types';
// Fork 增强: Kiro 和 Copilot 配额支持
import type { KiroQuotaPayload, CopilotQuotaPayload } from '@/types';
```

### 2. 解析函数（在文件末尾）

```typescript
export function parseKiroQuotaPayload(payload: unknown): KiroQuotaPayload | null {
  if (payload === undefined || payload === null) return null;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed) as KiroQuotaPayload;
    } catch {
      return null;
    }
  }
  if (typeof payload === 'object') {
    return payload as KiroQuotaPayload;
  }
  return null;
}

export function parseKiroErrorPayload(payload: unknown): { reason?: string; message?: string } | null {
  // 类似结构...
}

export function parseCopilotQuotaPayload(payload: unknown): CopilotQuotaPayload | null {
  // 类似结构...
}
```

## 冲突解决

1. Import 分离到单独行
2. 解析函数在文件末尾，一般不会冲突
