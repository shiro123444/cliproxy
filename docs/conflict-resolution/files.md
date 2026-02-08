# 修改的文件清单

## 核心文件（容易冲突）

| 文件 | 修改类型 | 冲突风险 |
|------|----------|----------|
| `src/pages/AuthFilesPage.tsx` | 添加 Kiro/Copilot 支持 | **高** |
| `src/pages/QuotaPage.tsx` | 添加 QuotaSection | 中 |
| `src/stores/useQuotaStore.ts` | 添加状态管理 | 中 |
| `src/components/quota/quotaConfigs.ts` | 添加配置 | 中 |
| `src/components/quota/index.ts` | 导出新配置 | 低 |

## 工具文件（低冲突风险）

| 文件 | 修改类型 |
|------|----------|
| `src/utils/quota/constants.ts` | 添加 API 配置和颜色 |
| `src/utils/quota/validators.ts` | 添加 isKiroFile/isCopilotFile |
| `src/utils/quota/parsers.ts` | 添加解析函数 |

## 类型和国际化（追加在末尾）

| 文件 | 修改类型 |
|------|----------|
| `src/types/quota.ts` | 追加类型定义 |
| `src/i18n/locales/zh-CN.json` | 追加翻译 |
| `src/i18n/locales/en.json` | 追加翻译 |

## Fork 专属文件（不会冲突）

- `.github/workflows/sync-upstream.yml`
- `docs/conflict-resolution/*`
- `docs/merge.md`
