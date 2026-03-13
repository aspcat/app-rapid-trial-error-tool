# 选题库管理模块

## 模块概述

选题库管理是 App 快速试错工具的核心模块之一，用于管理 App 关键词、标注关键指标并排序优先级。

## 核心功能

### 1. 选题管理
- 添加新选题（关键词）
- 编辑现有选题
- 删除选题

### 2. 指标标注
- 市场容量 (1-10)
- 竞争程度 (1-10)
- 技术难度 (1-10)
- 开发优先级 (1-10)

### 3. 自定义字段
- 支持添加自定义字段
- 自定义字段自动添加到表格

### 4. 数据导出
- 导出 Excel 模板
- 包含所有字段

## 数据结构

```typescript
interface Topic {
  id: number;
  keyword: string;
  marketSize: number;      // 1-10
  competition: number;     // 1-10
  difficulty: number;     // 1-10
  priority: number;        // 1-10
  [customField: string]: any;  // 自定义字段
}
```

## 方法论

基于"关键词驱动 + 两周闭环 + 数据导向"方法论：
1. 从用户痛点和市场需求出发，提取核心关键词
2. 为每个选题标注市场容量、竞争程度、技术难度等指标
3. 结合指标和个人能力，排序开发优先级
4. 选择优先级最高的选题，制定两周内可完成的 MVP 计划

## 组件接口

```jsx
import TopicLibrary from './components/TopicLibrary';

<TopicLibrary />
```

## 依赖

- Ant Design Table, Form, Modal, Input, Select
- @ant-design/icons
- LocalStorage API
