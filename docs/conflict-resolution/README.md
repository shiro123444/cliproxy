# Fork 冲突解决指南

本 Fork 在上游基础上添加了 **Kiro** 和 **GitHub Copilot** 配额显示功能。

## 核心原则

1. **保留两边代码** - 上游的新功能 + 我们的增强功能
2. **Fork 代码有注释标记** - 搜索 `// Fork 增强` 识别我们的代码
3. **Fork 代码在末尾** - 尽量放在文件/对象/函数末尾减少冲突

## 文档索引

| 文件 | 说明 |
|------|------|
| [overview.md](./overview.md) | Fork 增强功能概览 |
| [files.md](./files.md) | 修改的文件清单 |
| [AuthFilesPage.md](./AuthFilesPage.md) | AuthFilesPage.tsx 冲突解决 |
| [QuotaPage.md](./QuotaPage.md) | QuotaPage.tsx 冲突解决 |
| [useQuotaStore.md](./useQuotaStore.md) | useQuotaStore.ts 冲突解决 |
| [quotaConfigs.md](./quotaConfigs.md) | quotaConfigs.ts 冲突解决 |
| [constants.md](./constants.md) | constants.ts 冲突解决 |
| [validators.md](./validators.md) | validators.ts 冲突解决 |
| [parsers.md](./parsers.md) | parsers.ts 冲突解决 |
| [types.md](./types.md) | quota.ts 类型定义 |
| [i18n.md](./i18n.md) | 国际化文件 |

## 快速命令

```bash
# 查看冲突文件
git diff --name-only --diff-filter=U

# 查看某文件的冲突
git diff <file>

# 合并后验证构建
npm run build
```
