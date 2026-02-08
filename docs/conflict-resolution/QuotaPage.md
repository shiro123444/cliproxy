# QuotaPage.tsx 冲突解决

## 我们的修改点

### 1. Import 语句

```typescript
import {
  QuotaSection,
  ANTIGRAVITY_CONFIG,
  CODEX_CONFIG,
  GEMINI_CLI_CONFIG
} from '@/components/quota';
// Fork 增强: Kiro 和 Copilot 配额支持
import { KIRO_CONFIG, COPILOT_CONFIG } from '@/components/quota';
```

### 2. QuotaSection 组件（在 GEMINI_CLI_CONFIG 后面）

```tsx
<QuotaSection
  config={GEMINI_CLI_CONFIG}
  files={files}
  loading={loading}
  disabled={disableControls}
/>
{/* Fork 增强: Kiro 和 Copilot 配额显示 */}
<QuotaSection
  config={KIRO_CONFIG}
  files={files}
  loading={loading}
  disabled={disableControls}
/>
<QuotaSection
  config={COPILOT_CONFIG}
  files={files}
  loading={loading}
  disabled={disableControls}
/>
```

## 冲突解决

如果上游添加了新的 QuotaSection，保持我们的在最后。
