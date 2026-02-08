# constants.ts 冲突解决

## 我们的修改点

### 1. TYPE_COLORS（在对象末尾）

```typescript
export const TYPE_COLORS: Record<string, TypeColorSet> = {
  // ... 上游的颜色配置
  unknown: {
    light: { bg: '#f0f0f0', text: '#666666', border: '1px dashed #999999' },
    dark: { bg: '#3a3a3a', text: '#aaaaaa', border: '1px dashed #666666' },
  },
  // Fork 增强: Kiro 和 Copilot 配额支持
  kiro: {
    light: { bg: '#fff8e1', text: '#ff8f00' },
    dark: { bg: '#ff6f00', text: '#ffe082' },
  },
  'github-copilot': {
    light: { bg: '#f0f0f0', text: '#24292f' },
    dark: { bg: '#30363d', text: '#c9d1d9' },
  },
};
```

### 2. API 配置（在文件末尾）

```typescript
// ============================================================================
// Fork 增强: Kiro 和 Copilot 配额支持
// ============================================================================

// Kiro (AWS CodeWhisperer) API configuration
export const KIRO_QUOTA_URL = 'https://codewhisperer.us-east-1.amazonaws.com';

export const KIRO_REQUEST_HEADERS = {
  'Content-Type': 'application/x-amz-json-1.0',
  'x-amz-target': 'AmazonCodeWhispererService.GetUsageLimits',
  Authorization: 'Bearer $TOKEN$',
};

export const KIRO_REQUEST_BODY = JSON.stringify({
  origin: 'AI_EDITOR',
  resourceType: 'AGENTIC_REQUEST',
});

// Copilot (GitHub Copilot) API configuration
export const COPILOT_QUOTA_URL = 'https://api.github.com/copilot_internal/user';

export const COPILOT_REQUEST_HEADERS = {
  Authorization: 'Bearer $TOKEN$',
  Accept: 'application/json',
  'User-Agent': 'CLIProxyAPIPlus',
};
```

## 冲突解决

1. 如果上游添加新颜色，保持我们的在 `unknown` 后面
2. API 配置在文件最末尾，一般不会冲突
