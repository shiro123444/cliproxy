# Copilot 额度查询 API 接口文档

## API 端点

```
POST /v0/management/api-call
```

---

## 请求格式

### 请求头
//

```http
POST /v0/management/api-call HTTP/1.1
Authorization: Bearer <MANAGEMENT_KEY>
Content-Type: application/json
```

### 请求体

```json
{
  "auth_index": "<COPILOT_AUTH_INDEX>",
  "method": "GET",
  "url": "https://api.github.com/copilot_internal/user",
  "header": {
    "Authorization": "Bearer $TOKEN$",
    "Accept": "application/json",
    "User-Agent": "CLIProxyAPIPlus"
  }
}
```

### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `auth_index` | string | 是 | Copilot 凭证索引，从 `/v0/management/auth-files` 获取 |
| `method` | string | 是 | 固定为 `GET` |
| `url` | string | 是 | GitHub Copilot 内部 API 端点 |
| `header` | object | 是 | 请求头，`$TOKEN$` 会自动替换为实际 Token |

---

## 响应格式

```json
{
  "status_code": 200,
  "header": { ... },
  "body": "<JSON 字符串，需要再次 JSON.parse>"
}
```

---

## body 解析后的结构

GitHub Copilot API 根据订阅类型返回**两种不同的结构**：

### 1. Free/Pro 用户

```json
{
  "login": "username",
  "access_type_sku": "free_limited_copilot",
  "assigned_date": "2024-12-30T11:30:17+08:00",
  "chat_enabled": true,
  "copilot_plan": "individual",
  "limited_user_quotas": {
    "chat": 450,
    "completions": 3500
  },
  "monthly_quotas": {
    "chat": 500,
    "completions": 4000
  },
  "limited_user_reset_date": "2026-02-28"
}
```

### 2. Business/Enterprise 用户

```json
{
  "login": "username",
  "access_type_sku": "copilot_enterprise_seat",
  "assigned_date": "2024-01-15",
  "chat_enabled": true,
  "copilot_plan": "business",
  "quota_reset_date": "2025-02-01T00:00:00Z",
  "quota_snapshots": {
    "chat": {
      "entitlement": 0,
      "remaining": 0,
      "percent_remaining": 0,
      "unlimited": true,
      "overage_permitted": false,
      "overage_count": 0
    },
    "completions": {
      "entitlement": 0,
      "remaining": 0,
      "percent_remaining": 0,
      "unlimited": true,
      "overage_permitted": false,
      "overage_count": 0
    },
    "premium_interactions": {
      "entitlement": 1000,
      "remaining": 755,
      "percent_remaining": 75.5,
      "unlimited": false,
      "overage_permitted": true,
      "overage_count": 0
    }
  }
}
```

---

## 字段说明

### 通用字段

| 字段 | 说明 |
|------|------|
| `copilot_plan` | 订阅计划：`individual` / `business` / `enterprise` |
| `access_type_sku` | SKU 类型 |
| `chat_enabled` | 是否启用聊天功能 |

### Free/Pro 用户特有字段

| 字段 | 说明 |
|------|------|
| `monthly_quotas` | 总配额（每月总量） |
| `limited_user_quotas` | 剩余配额（当前周期还能用多少） |
| `limited_user_reset_date` | 配额重置日期 |

> 已使用 = `monthly_quotas` - `limited_user_quotas`

### Business/Enterprise 用户特有字段

| 字段 | 说明 |
|------|------|
| `quota_reset_date` | 配额重置日期 |
| `quota_snapshots` | 配额快照，包含 `chat`、`completions`、`premium_interactions` |

### quota_snapshots 子字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `entitlement` | number | 总配额 |
| `remaining` | number | 剩余配额 |
| `percent_remaining` | number | 剩余百分比 (0-100) |
| `unlimited` | bool | 是否无限额度 |
| `overage_permitted` | bool | 是否允许超额使用 |
| `overage_count` | number | 已超额使用量 |

---

## 订阅计划对照表

| copilot_plan | access_type_sku | 说明 | 配额格式 |
|--------------|-----------------|------|---------|
| `individual` | `free_limited_copilot` | Copilot Free | `limited_user_quotas` |
| `individual` | `copilot_for_individual` | Copilot Pro | `limited_user_quotas` |
| `business` | `copilot_for_business_seat` | Copilot Business | `quota_snapshots` |
| `enterprise` | `copilot_enterprise_seat` | Copilot Enterprise | `quota_snapshots` |

---

## 调用示例

```bash
curl -sS -X POST "http://127.0.0.1:8317/v0/management/api-call" \
  -H "Authorization: Bearer <MANAGEMENT_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "auth_index": "<COPILOT_AUTH_INDEX>",
    "method": "GET",
    "url": "https://api.github.com/copilot_internal/user",
    "header": {
      "Authorization": "Bearer $TOKEN$",
      "Accept": "application/json",
      "User-Agent": "CLIProxyAPIPlus"
    }
  }'
```
