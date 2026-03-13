# 需求挖掘模块

## 模块概述

需求挖掘模块用于从选题库和竞品分析中提取需求，进行分类整理和优先级排序。

## 核心功能

### 1. 需求采集
- 从选题库导入
- 从竞品分析提取
- 手动添加

### 2. 需求分类
- 功能需求
- 非功能需求
- 体验需求

### 3. 优先级管理
- 高优先级
- 中优先级
- 低优先级

### 4. 需求详情
- 需求描述
- 来源
- 关联选题
- 关联竞品

## 数据结构

```typescript
interface Requirement {
  id: number;
  title: string;
  description: string;
  category: 'function' | 'non-function' | 'experience';
  priority: 'high' | 'medium' | 'low';
  source?: string;
  relatedTopicIds?: number[];
  relatedCompetitorIds?: number[];
  status: 'pending' | 'in-progress' | 'completed';
}
```

## 方法论

1. 从用户痛点和市场需求出发
2. 结合竞品分析结果
3. 识别核心需求和差异化需求
4. 制定产品路线图

## 组件接口

```jsx
import RequirementMining from './components/RequirementMining';

<RequirementMining />
```

## 依赖

- Ant Design Table, Form, Modal, Input, Select
- @ant-design/icons
- LocalStorage API
