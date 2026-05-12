# Vercel 自动部署配置指南

## 项目信息

- **项目名称**: app-quick-validation-tool
- **框架**: React + Vite
- **构建命令**: `npm run build`
- **输出目录**: `dist`

## Vercel 部署步骤

### 1. 连接 GitHub 仓库

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 授权 Vercel 访问您的 GitHub 账户
5. 选择仓库: `aspcat/app-rapid-trial-error-tool`

### 2. 配置项目设置

Vercel 会自动检测到这是一个 Vite 项目，并使用 `vercel.json` 中的配置。确认以下设置：

- **Framework Preset**: Vite
- **Build Command**: `npm run build` (已在 vercel.json 中配置)
- **Output Directory**: `dist` (已在 vercel.json 中配置)
- **Install Command**: `npm install` (已在 vercel.json 中配置)

### 3. 环境变量配置（如需要）

如果项目需要环境变量，在 Vercel 项目设置中添加：

1. 进入项目 Settings → Environment Variables
2. 添加所需的环境变量
3. 选择应用的环境: Production, Preview, Development

### 4. 部署触发

部署会在以下情况自动触发：

- 推送代码到 `main` 分支（生产环境部署）
- 创建 Pull Request（预览部署）
- 手动触发部署（在 Vercel Dashboard 中）

## vercel.json 配置说明

当前配置包含：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 配置项说明

- **buildCommand**: 构建命令
- **outputDirectory**: 构建输出目录
- **installCommand**: 依赖安装命令
- **framework**: 项目框架类型
- **rewrites**: SPA 路由重写规则，确保所有路由都指向 index.html
- **headers**: 静态资源缓存配置，提升性能

## 分支部署策略

- **Production**: `main` 分支 → 生产环境
- **Preview**: 其他分支/Pull Request → 预览环境

## 构建优化建议

当前构建输出显示主 JS 文件较大（1.5MB），建议考虑：

1. 使用动态导入（Dynamic Import）进行代码分割
2. 配置 `manualChunks` 优化分包
3. 按需加载第三方库

## 常见问题

### Q: 部署失败怎么办？

检查 Vercel 的构建日志，常见原因：
- 依赖安装失败
- 构建命令错误
- 环境变量缺失

### Q: 如何查看部署状态？

1. 在 Vercel Dashboard 中查看项目
2. 点击 "Deployments" 标签
3. 查看每次部署的状态和日志

### Q: 如何回滚到之前的版本？

1. 在 Vercel Dashboard 中进入项目
2. 找到之前成功的部署
3. 点击 "..." 菜单，选择 "Promote to Production"

## 相关链接

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
