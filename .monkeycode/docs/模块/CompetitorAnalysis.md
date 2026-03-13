# 竞品分析模块

## 模块概述

竞品分析模块用于收集和管理竞争对手信息，分析其核心功能、优势和不足，为产品决策提供参考。

## 核心功能

### 1. 竞品管理
- 添加竞品信息
- 编辑竞品数据
- 删除竞品

### 2. 竞品分类
- 直接竞品
- 间接竞品

### 3. 分析维度
- 竞品名称
- 核心功能
- 优势分析
- 不足分析
- 综合评分 (1-10)

### 4. 数据筛选
- 按竞品类型筛选
- 按评分排序

## 数据结构

```typescript
interface Competitor {
  id: number;
  name: string;
  type: 'direct' | 'indirect';
  coreFeatures: string;
  strengths: string;
  weaknesses: string;
  score: number;
  notes?: string;
}
```

## 方法论

1. 选择 3-5 个直接竞品和 1-2 个间接竞品进行分析
2. 重点关注核心功能、用户体验、商业模式
3. 识别竞品的优势和不足，寻找差异化机会
4. 为后续需求挖掘和产品设计提供参考

## 组件接口

```jsx
import CompetitorAnalysis from './components/CompetitorAnalysis';

<CompetitorAnalysis />
```

## 依赖

- Ant Design Table, Form, Modal, Input, Select, Tag
- @ant-design/icons
- LocalStorage API
