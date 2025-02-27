# Chinese Name Generator (中文名生成器)

一个基于AI技术的中文名生成工具，为外国人创建有文化内涵的中文名字。

## 项目描述

本项目利用DeepSeek AI技术，根据用户输入的英文名，生成具有文化内涵和意义的中文名字。每个生成的中文名都包含详细的解释，包括拼音、中英文含义以及相关的文化参考。特别为2025蛇年设计，提供了美观的用户界面和双语支持。

## 功能特点

- **AI驱动**: 基于DeepSeek R1 AI模型，提供智能化的名字生成
- **文化内涵**: 每个名字都附带详细的文化背景和含义解释
- **用户友好**: 简洁直观的界面设计，操作简单
- **响应式设计**: 适配各种设备屏幕尺寸
- **双语支持**: 同时支持中文和英文界面元素
- **实时生成**: 快速响应用户请求，提供即时反馈
- **安全部署**: 使用Netlify Functions保护API密钥
- **GitHub Pages**: 支持通过GitHub Pages轻松部署

## 技术栈

- 前端: HTML5, CSS3, JavaScript (原生)
- 后端: Netlify Functions (无服务器函数)
- API: DeepSeek AI API
- 部署: GitHub Pages + Netlify

## 安装与使用

### 前提条件

- GitHub账号
- Netlify账号 (用于保护API密钥)
- DeepSeek AI API密钥

### 部署步骤

#### GitHub Pages部署

1. Fork本仓库到您的GitHub账号
2. 在仓库设置中启用GitHub Pages
   - 进入仓库设置 -> Pages
   - 选择部署源为GitHub Actions
   - 系统将自动使用仓库中的`.github/workflows/deploy.yml`文件进行部署

#### 保护API密钥

1. 注册Netlify账号并连接您的GitHub仓库
2. 在Netlify设置中添加环境变量
   - 进入Site settings -> Environment variables
   - 添加变量名`DEEPSEEK_API_KEY`，值为您的DeepSeek API密钥
3. 部署Netlify Functions
   - Netlify将自动检测`netlify.toml`配置和`functions`目录
   - 部署完成后，函数将可通过`/.netlify/functions/generate-names`访问

## 使用方法

1. 在输入框中输入您的英文名
2. 点击"Generate Chinese Name"按钮
3. 等待几秒钟，系统将生成三个独特的中文名
4. 每个名字都包含中文字符、拼音、含义解释和文化参考

## API集成

本项目使用DeepSeek AI API生成中文名。API请求通过Netlify Functions处理，确保API密钥不会暴露在前端代码中。API请求格式如下:

```json
{
  "model": "deepseek-v3-241226",
  "messages": [
    {"role": "system", "content": "系统提示..."},
    {"role": "user", "content": "用户提示..."}  
  ]
}
```

## 项目结构

- `index.html`: 主页面HTML结构
- `styles.css`: 样式表文件
- `script.js`: 前端JavaScript逻辑
- `functions/generate-names.js`: Netlify无服务器函数，处理API请求
- `netlify.toml`: Netlify配置文件
- `.github/workflows/deploy.yml`: GitHub Actions工作流配置
- `snake-icon.svg`: 蛇年图标

## 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

## 许可证

本项目采用MIT许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 项目GitHub: [https://github.com/yourusername/chinese-name-generator](https://github.com/yourusername/chinese-name-generator)
- 电子邮件: your.email@example.com

---

© 2025 Chinese Name Generator | Powered by DeepSeek R1 AI