# quotaConfigs.ts 冲突解决

## 我们的修改点

### 1. Import 类型

```typescript
import type {
  // ... 上游的类型
  GeminiCliQuotaState,
} from '@/types';
// Fork 增强: Kiro 和 Copilot 配额支持
import type {
  KiroQuotaState,
  KiroBaseQuota,
  KiroFreeTrialQuota,
  CopilotQuotaState,
  CopilotQuotaItem,
} from '@/types';
```

### 2. Import 工具函数

在上游的 import 后添加：

```typescript
} from '@/utils/quota';
// Fork 增强: Kiro 和 Copilot 配额支持
import {
  KIRO_QUOTA_URL,
  KIRO_REQUEST_HEADERS,
  KIRO_REQUEST_BODY,
  COPILOT_QUOTA_URL,
  COPILOT_REQUEST_HEADERS,
  parseKiroQuotaPayload,
  parseKiroErrorPayload,
  parseCopilotQuotaPayload,
} from '@/utils/quota';
```

### 3. QuotaStore 接口

```typescript
geminiCliQuota: Record<string, GeminiCliQuotaState>;
// Fork 增强: Kiro 和 Copilot 配额
kiroQuota: Record<string, KiroQuotaState>;
copilotQuota: Record<string, CopilotQuotaState>;
```

### 4. KIRO_CONFIG 和 COPILOT_CONFIG

这两个配置对象在文件末尾，约 400+ 行，包含完整的配额加载和渲染逻辑。

## 冲突解决

1. 接受上游对现有配置的修改
2. 确保我们的 import 在单独行
3. KIRO_CONFIG 和 COPILOT_CONFIG 保持在文件末尾
