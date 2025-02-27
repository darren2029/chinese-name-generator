# Netlify 配置指南

本指南将帮助您在 Netlify 上部署中文名生成器项目，并正确配置 Netlify Functions 以保护 API 密钥。

## 步骤 1: 创建 Netlify 账户

1. 访问 [Netlify 官网](https://www.netlify.com/) 并注册一个账户
2. 完成注册流程并登录到 Netlify 控制面板

## 步骤 2: 连接 GitHub 仓库

1. 在 Netlify 控制面板中，点击 "New site from Git" 按钮
2. 选择 "GitHub" 作为您的 Git 提供商
3. 授权 Netlify 访问您的 GitHub 账户
4. 从列表中选择您的 "chinese-name-generator" 仓库

## 步骤 3: 配置部署设置

在部署设置页面中，配置以下选项：

- **Owner**: 选择您的团队或个人账户
- **Branch to deploy**: `main`（或您的主分支名称）
- **Build command**: 留空（因为这是一个静态网站，无需构建）
- **Publish directory**: `.`（部署整个项目根目录）

点击 "Deploy site" 按钮开始部署。

## 步骤 4: 配置环境变量

为了保护您的 DeepSeek API 密钥，需要在 Netlify 中设置环境变量：

1. 在您的站点控制面板中，导航到 "Site settings" > "Environment variables"
2. 点击 "Add variable" 按钮
3. 添加以下环境变量：
   - 键(Key): `DEEPSEEK_API_KEY`
   - 值(Value): 您的 DeepSeek API 密钥（例如：`e10c3a1a-5a5f-4ca0-ad72-d2c3dcaa77fc`）
4. 点击 "Save" 保存环境变量

## 步骤 5: 配置 Netlify Functions

Netlify Functions 已经在项目中配置好了，通过 `netlify.toml` 文件：

```toml
[build]
  publish = "."
  functions = "functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

这个配置告诉 Netlify：
- 将整个项目目录作为静态网站发布
- 将 `functions` 目录作为 Netlify Functions 的源目录
- 将 `/api/*` 路径重定向到 `/.netlify/functions/*`，使 API 调用更简洁

## 步骤 6: 重新部署站点

配置完环境变量后，您需要重新部署站点以使更改生效：

1. 在站点控制面板中，导航到 "Deploys" 标签
2. 点击 "Trigger deploy" > "Deploy site"

## 步骤 7: 测试部署

部署完成后：

1. 点击 Netlify 提供的预览 URL（通常是 `https://your-site-name.netlify.app`）
2. 在中文名生成器界面中输入一个英文名
3. 点击 "Generate Chinese Name" 按钮测试功能是否正常工作

## 步骤 8: 配置自定义域名（可选）

如果您想使用自定义域名：

1. 在站点控制面板中，导航到 "Domain settings"
2. 点击 "Add custom domain"
3. 输入您的域名并按照说明进行配置

## 故障排除

如果您遇到问题：

1. 检查 Netlify 的 "Functions" 标签页，查看函数日志和错误信息
2. 确认环境变量 `DEEPSEEK_API_KEY` 已正确设置
3. 检查浏览器控制台是否有任何错误消息

## 注意事项

- Netlify 的免费计划对 Functions 有一定的使用限制，请查阅 [Netlify 定价页面](https://www.netlify.com/pricing/) 了解详情
- 确保您的 DeepSeek API 密钥有足够的配额来处理预期的请求量

如有任何问题，请参考 [Netlify 文档](https://docs.netlify.com/) 或联系项目维护者获取帮助。