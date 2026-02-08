# validators.ts 冲突解决

## 我们的修改点

在文件末尾添加：

```typescript
// ============================================================================
// Fork 增强: Kiro 和 Copilot 配额支持
// ============================================================================

export function isKiroFile(file: AuthFileItem): boolean {
  return resolveAuthProvider(file) === 'kiro';
}

export function isCopilotFile(file: AuthFileItem): boolean {
  return resolveAuthProvider(file) === 'github-copilot';
}
```

## 冲突解决

这些函数在文件末尾，一般不会冲突。

如果上游也添加了新的 `isXxxFile` 函数，保持我们的在最后。
