# 上游合并冲突解决指南

当 GitHub Actions 自动同步失败并创建 Issue 时，按照本指南手动解决冲突。

## 📋 前置条件

确保你已经 clone 了 Fork 仓库到本地：

```bash
git clone https://github.com/你的用户名/Cli-Proxy-API-Management-Center.git
cd Cli-Proxy-API-Management-Center
```

## 🔧 一次性配置（首次操作）

添加上游仓库作为远程源：

```bash
git remote add upstream https://github.com/router-for-me/Cli-Proxy-API-Management-Center.git
```

验证远程仓库配置：

```bash
git remote -v
# 应该显示：
# origin    https://github.com/你的用户名/Cli-Proxy-API-Management-Center.git (fetch)
# origin    https://github.com/你的用户名/Cli-Proxy-API-Management-Center.git (push)
# upstream  https://github.com/router-for-me/Cli-Proxy-API-Management-Center.git (fetch)
# upstream  https://github.com/router-for-me/Cli-Proxy-API-Management-Center.git (push)
```

## 🚀 合并流程

### 步骤 1：同步本地仓库

```bash
# 切换到 main 分支
git checkout main

# 拉取你 Fork 仓库的最新代码
git pull origin main

# 获取上游仓库的最新代码
git fetch upstream
```

### 步骤 2：尝试合并上游

```bash
git merge upstream/main
```

如果没有冲突，会自动完成合并，跳到 **步骤 5**。

如果有冲突，会显示类似：

```
Auto-merging src/types/quota.ts
CONFLICT (content): Merge conflict in src/types/quota.ts
Auto-merging src/i18n/locales/zh-CN.json
CONFLICT (content): Merge conflict in src/i18n/locales/zh-CN.json
Automatic merge failed; fix conflicts and then commit the result.
```

### 步骤 3：查看冲突文件

```bash
# 查看哪些文件有冲突
git status

# 查看具体冲突内容
git diff
```

冲突文件中会包含类似标记：

```
<<<<<<< HEAD
// 你的代码（Fork 仓库的内容）
export interface KiroQuotaState { ... }
=======
// 上游代码（原仓库的内容）
export interface SomeNewFeature { ... }
>>>>>>> upstream/main
```

### 步骤 4：解决冲突

#### 方法 A：手动编辑

打开冲突文件，删除冲突标记（`<<<<<<<`、`=======`、`>>>>>>>`），保留需要的代码。

**通常的合并策略：**
- 保留上游的新功能代码
- 保留你添加的 Kiro/Copilot 代码
- 确保两边代码都存在且不重复

#### 方法 B：让 Claude 帮助

1. 复制冲突文件的完整内容
2. 发送给 Claude，说明：
   - 这是合并冲突
   - `HEAD` 部分是你的 Fork 代码
   - `upstream/main` 部分是上游代码
   - 请帮我合并，保留两边的功能

3. Claude 会给出合并后的代码，直接替换文件内容

#### 解决后标记文件

```bash
# 标记冲突已解决
git add src/types/quota.ts
git add src/i18n/locales/zh-CN.json
# 或者一次性添加所有
git add .
```

### 步骤 5：提交合并

```bash
git commit -m "Merge upstream changes"
```

如果是自动合并成功（无冲突），Git 会自动创建 commit message。

### 步骤 6：验证构建

```bash
# 安装依赖
npm ci

# 构建项目
npm run build
```

如果构建失败，说明存在语义冲突（代码逻辑不兼容），需要进一步修复。

### 步骤 7：推送到远程

```bash
git push origin main
```

## 📝 常见冲突场景及解决方案

### 场景 1：JSON 文件末尾冲突

**冲突示例：**
```json
<<<<<<< HEAD
  },
  "kiro_quota": {
    "title": "Kiro 额度"
  }
}
=======
  },
  "new_feature": {
    "title": "新功能"
  }
}
>>>>>>> upstream/main
```

**解决方案：** 保留两边内容
```json
  },
  "new_feature": {
    "title": "新功能"
  },
  "kiro_quota": {
    "title": "Kiro 额度"
  }
}
```

### 场景 2：TypeScript 类型定义冲突

**冲突示例：**
```typescript
<<<<<<< HEAD
export interface KiroQuotaState { ... }
export interface CopilotQuotaState { ... }
=======
export interface NewFeatureState { ... }
>>>>>>> upstream/main
```

**解决方案：** 保留所有类型定义
```typescript
export interface NewFeatureState { ... }
export interface KiroQuotaState { ... }
export interface CopilotQuotaState { ... }
```

### 场景 3：同一函数被双方修改

这种情况需要仔细分析两边的修改意图，可能需要：
- 合并两边的逻辑
- 或者选择一边并手动添加另一边的功能

建议发给 Claude 帮助分析。

## ⚠️ 注意事项

1. **不要直接 `git merge --abort`**，除非你想放弃本次合并
2. **合并前确保本地没有未提交的更改**，可以用 `git stash` 暂存
3. **构建验证很重要**，即使 Git 合并成功，代码也可能无法编译
4. **保持 Fork 增强功能**：Kiro 和 Copilot 配额相关代码要保留

## 🔄 快速命令汇总

```bash
# 完整流程（无冲突情况）
git checkout main
git pull origin main
git fetch upstream
git merge upstream/main
npm ci && npm run build
git push origin main

# 有冲突时
git checkout main
git pull origin main
git fetch upstream
git merge upstream/main
# 解决冲突...
git add .
git commit -m "Merge upstream changes"
npm ci && npm run build
git push origin main
```

## 🆘 遇到问题？

如果遇到无法解决的冲突：

1. 复制 Issue 中的冲突文件内容
2. 或者执行 `git diff` 复制输出
3. 发送给 Claude，说明需要帮助合并上游代码

Claude 会分析冲突并给出具体的解决方案。
