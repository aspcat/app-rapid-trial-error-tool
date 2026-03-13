# 接口文档

## 组件接口

### App (主应用)

```tsx
const App = () => {
  // State
  currentModule: string      // 当前模块 key
  showTour: boolean          // 是否显示引导
  tourOpen: boolean          // Tour 组件是否打开

  // Methods
  setCurrentModule(key: string): void
  handleTourStart(): void
  handleTourClose(): void
  renderModule(): ReactNode
  handleExport(format: string): void
}
```

### TopicLibrary (选题库管理)

```tsx
const TopicLibrary = () => {
  // State
  topics: Topic[]            // 选题列表
  isModalVisible: boolean    // Modal 是否显示
  editingTopic: Topic | null // 当前编辑的选题
  form: FormInstance         // 表单实例
  customFields: CustomField[] // 自定义字段

  // Methods
  handleAdd(): void
  handleEdit(record: Topic): void
  handleDelete(id: number): void
  handleOk(): Promise<void>
  handleCancel(): void
  handleAddCustomField(): void
  handleExportTemplate(): void
  getColumnsWithCustomFields(): Column[]
}
```

### CompetitorAnalysis (竞品分析)

```tsx
const CompetitorAnalysis = () => {
  // State
  competitors: Competitor[]  // 竞品列表
  isModalVisible: boolean    // Modal 是否显示
  editingCompetitor: Competitor | null
  form: FormInstance

  // Methods
  handleAdd(): void
  handleEdit(record: Competitor): void
  handleDelete(id: number): void
  handleOk(): Promise<void>
  handleExport(): void
}
```

### RequirementMining (需求挖掘)

```tsx
const RequirementMining = () => {
  // State
  requirements: Requirement[] // 需求列表
  isModalVisible: boolean
  editingRequirement: Requirement | null
  form: FormInstance

  // Methods
  handleAdd(): void
  handleEdit(record: Requirement): void
  handleDelete(id: number): void
  handleOk(): Promise<void>
}
```

## 数据类型

### Topic (选题)

```typescript
interface Topic {
  id: number;
  keyword: string;
  marketSize: number;      // 1-10
  competition: number;     // 1-10
  difficulty: number;      // 1-10
  priority: number;        // 1-10
  [key: string]: any;     // 自定义字段
}
```

### Competitor (竞品)

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

### Requirement (需求)

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

### CustomField (自定义字段)

```typescript
interface CustomField {
  key: string;
  name: string;
}
```

## LocalStorage 键名

| 键名 | 数据类型 | 说明 |
|------|----------|------|
| topicLibrary | Topic[] | 选题库数据 |
| customFields | CustomField[] | 自定义字段 |
| competitors | Competitor[] | 竞品数据 |
| requirements | Requirement[] | 需求数据 |
| hasVisited | string | 新手引导状态 |
