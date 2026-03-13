# 开发者指南

## 1. 环境要求

- Node.js 16+
- npm 或 pnpm

## 2. 安装依赖

```bash
npm install
```

## 3. 运行项目

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 4. 项目结构

```
src/
├── App.jsx              # 主应用，包含布局和路由
├── index.jsx            # React 入口
├── components/          # 功能组件
│   ├── TopicLibrary/    # 选题库
│   ├── CompetitorAnalysis/ # 竞品分析
│   └── RequirementMining/  # 需求挖掘
```

## 5. 核心概念

### 数据持久化
所有数据存储在 LocalStorage 中：
- `topicLibrary` - 选题数据
- `competitors` - 竞品数据
- `requirements` - 需求数据
- `customFields` - 自定义字段
- `hasVisited` - 新手引导状态

### 组件通信
- 使用 React Hooks (useState, useEffect) 管理状态
- 父组件通过 props 传递数据和回调函数

## 6. 添加新模块

1. 在 `src/components/` 下创建新组件
2. 在 `App.jsx` 的 menuItems 中添加菜单项
3. 在 `renderModule()` 中添加路由映射

## 7. 样式规范

- 使用 Less 预处理器
- 组件样式文件与组件同名
- 参考现有组件的样式结构
