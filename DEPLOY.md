# CLIProxy 部署指南

这是一个完整的 CLI Proxy API 管理系统，包含前端管理界面和后端 API 服务。

## 🚀 快速部署（服务器端）

### 前置要求
- Docker 和 Docker Compose
- Git

### 部署步骤

1. **克隆仓库**
```bash
git clone git@github.com:shiro123444/cliproxy.git
cd cliproxy
```

2. **配置后端服务**
```bash
cd CLIProxyAPI
cp config.example.yaml config.yaml
```

编辑 `config.yaml`，修改以下关键配置：
```yaml
host: "0.0.0.0"  # 允许外网访问
port: 8317

remote-management:
  allow-remote: true
  secret-key: "your-management-key"  # 修改为你的管理密钥

api-keys:
  - "your-api-key"  # 修改为你的 API 密钥
```

3. **启动服务**
```bash
docker compose up -d
```

4. **查看日志**
```bash
docker compose logs -f
```

5. **访问管理界面**
- 后端 API: `http://your-server-ip:8317`
- 内置管理界面: `http://your-server-ip:8317/management.html`

## 📦 前端开发环境

如果需要修改前端界面：

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`

## 🔑 上传 ChatGPT 账号

1. 访问管理界面
2. 点击左侧 "认证文件"
3. 上传 JSON 格式的账号文件

JSON 格式示例：
```json
{
  "access_token": "eyJhbGci..."
}
```

## 🌐 使用 API

### 端点地址
```
http://your-server-ip:8317/v1/chat/completions
```

### 请求示例
```bash
curl http://your-server-ip:8317/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## 🔧 常用命令

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看日志
docker compose logs -f

# 查看运行状态
docker compose ps
```

## 📝 注意事项

1. **安全性**：
   - 修改默认的管理密钥和 API 密钥
   - 建议使用 Nginx 反向代理并配置 HTTPS
   - 不要将 `config.yaml` 和 `auths/` 目录提交到 Git

2. **性能**：
   - 600 个账号建议配置负载均衡策略
   - 监控使用统计，避免单个账号超限

3. **备份**：
   - 定期备份 `auths/` 目录
   - 备份 `config.yaml` 配置文件

## 🆘 故障排查

### 服务无法启动
```bash
docker compose logs
```

### 管理界面无法连接
- 检查 `allow-remote: true` 是否配置
- 检查防火墙是否开放 8317 端口
- 检查管理密钥是否正确

### API 请求失败
- 检查 API 密钥是否正确
- 查看使用统计页面，确认账号是否正常
- 检查日志中的错误信息

## 📚 更多信息

- [CLIProxyAPI 官方文档](https://help.router-for.me/)
- [管理界面项目](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)
