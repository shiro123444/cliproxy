# quota.ts 类型定义

## 我们的修改点

在文件末尾追加（约 145 行后）：

```typescript
// Kiro (AWS CodeWhisperer) API payload types
export interface KiroSubscriptionInfo {
  subscriptionTitle: string;
  type?: string;
  overageCapability?: string;
  upgradeCapability?: string;
}

export interface KiroFreeTrialInfo {
  freeTrialStatus: string;
  usageLimitWithPrecision: number;
  currentUsageWithPrecision: number;
  freeTrialExpiry: number;
}

export interface KiroUsageBreakdown {
  resourceType: string;
  usageLimitWithPrecision: number;
  currentUsageWithPrecision: number;
  nextDateReset?: number;
  freeTrialInfo?: KiroFreeTrialInfo;
  overageRate?: number;
  currency?: string;
}

export interface KiroQuotaPayload {
  daysUntilReset?: number;
  nextDateReset: number;
  subscriptionInfo: KiroSubscriptionInfo;
  usageBreakdownList: KiroUsageBreakdown[];
  userInfo?: { userId: string };
}

export interface KiroQuotaErrorPayload {
  __type?: string;
  message?: string;
  reason?: string;
}

export interface KiroBaseQuota {
  used: number;
  limit: number;
  resetTime: number;
}

export interface KiroFreeTrialQuota {
  used: number;
  limit: number;
  expiry: number;
  status: string;
}

export interface KiroQuotaState {
  status: 'idle' | 'loading' | 'success' | 'error';
  subscriptionTitle: string | null;
  baseQuota: KiroBaseQuota | null;
  freeTrialQuota: KiroFreeTrialQuota | null;
  error?: string;
  errorStatus?: number;
}

// Copilot (GitHub Copilot) API payload types
export interface CopilotLimitedQuotas {
  chat?: number;
  completions?: number;
}

export interface CopilotQuotaSnapshot {
  entitlement?: number;
  remaining?: number;
  percent_remaining?: number;
  unlimited?: boolean;
  overage_permitted?: boolean;
  overage_count?: number;
}

export interface CopilotQuotaSnapshots {
  chat?: CopilotQuotaSnapshot;
  completions?: CopilotQuotaSnapshot;
  premium_interactions?: CopilotQuotaSnapshot;
}

export interface CopilotQuotaPayload {
  login?: string;
  copilot_plan?: string;
  access_type_sku?: string;
  chat_enabled?: boolean;
  // Free/Pro
  limited_user_quotas?: CopilotLimitedQuotas;
  monthly_quotas?: CopilotLimitedQuotas;
  limited_user_reset_date?: string;
  // Business/Enterprise
  quota_reset_date?: string;
  quota_snapshots?: CopilotQuotaSnapshots;
}

export interface CopilotQuotaItem {
  id: string;
  label: string;
  used: number;
  limit: number;
  percent: number;
  unlimited: boolean;
}

export interface CopilotQuotaState {
  status: 'idle' | 'loading' | 'success' | 'error';
  plan: string | null;
  items: CopilotQuotaItem[];
  resetDate: string | null;
  error?: string;
  errorStatus?: number;
}
```

## 冲突解决

类型定义追加在文件末尾，一般不会冲突。
