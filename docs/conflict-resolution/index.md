# index.ts 导出

## 文件位置

`src/components/quota/index.ts`

## 我们的修改点

```typescript
export { ANTIGRAVITY_CONFIG, CODEX_CONFIG, GEMINI_CLI_CONFIG } from './quotaConfigs';
// Fork 增强: Kiro 和 Copilot 配额支持
export { KIRO_CONFIG, COPILOT_CONFIG } from './quotaConfigs';
```

## 冲突解决

如果上游添加新的 CONFIG 导出，保持我们的在单独行。
