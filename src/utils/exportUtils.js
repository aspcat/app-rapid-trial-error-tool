import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename, columns) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const exportData = data.map(item => {
    const row = {};
    columns.forEach(col => {
      if (col.dataIndex) {
        row[col.title || col.dataIndex] = formatCellValue(item[col.dataIndex], col);
      }
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  const colWidths = columns.map(col => ({
    wch: Math.max(col.title?.length || 10, 15)
  }));
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToCSV = (data, filename, columns) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const exportData = data.map(item => {
    const row = {};
    columns.forEach(col => {
      if (col.dataIndex) {
        row[col.title || col.dataIndex] = formatCellValue(item[col.dataIndex], col);
      }
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToJSON = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const formatCellValue = (value, column) => {
  if (value === null || value === undefined) return '';
  
  if (column.dataIndex === 'marketSize' || column.dataIndex === 'competition' || 
      column.dataIndex === 'difficulty' || column.dataIndex === 'priority' ||
      column.dataIndex === 'score') {
    return typeof value === 'number' ? `${value}/10` : value;
  }
  
  if (column.dataIndex === 'type') {
    const typeMap = { 'direct': '直接竞品', 'indirect': '间接竞品' };
    return typeMap[value] || value;
  }
  
  if (column.dataIndex === 'status') {
    const statusMap = {
      'pending': '待评估',
      'confirmed': '已确认',
      'rejected': '已拒绝',
      'not-started': '未开始',
      'in-progress': '进行中',
      'completed': '已完成',
      'delayed': '已延期'
    };
    return statusMap[value] || value;
  }
  
  if (column.dataIndex === 'source') {
    const sourceMap = {
      'interview': '用户访谈',
      'survey': '问卷调研',
      'review': '应用商店评论',
      'community': '社区讨论',
      'analytics': '数据分析'
    };
    return sourceMap[value] || value;
  }
  
  if (column.dataIndex === 'startDate' || column.dataIndex === 'endDate') {
    return value ? new Date(value).toLocaleDateString('zh-CN') : '';
  }
  
  return value;
};

export const topicLibraryColumns = [
  { title: '关键词', dataIndex: 'keyword' },
  { title: '市场容量', dataIndex: 'marketSize' },
  { title: '竞争程度', dataIndex: 'competition' },
  { title: '技术难度', dataIndex: 'difficulty' },
  { title: '优先级', dataIndex: 'priority' }
];

export const competitorAnalysisColumns = [
  { title: '竞品名称', dataIndex: 'name' },
  { title: '类型', dataIndex: 'type' },
  { title: '官网链接', dataIndex: 'url' },
  { title: '核心功能', dataIndex: 'coreFeatures' },
  { title: '优势', dataIndex: 'strengths' },
  { title: '不足', dataIndex: 'weaknesses' },
  { title: '评分', dataIndex: 'score' }
];

export const requirementMiningColumns = [
  { title: '需求描述', dataIndex: 'description' },
  { title: '来源渠道', dataIndex: 'source' },
  { title: '用户价值', dataIndex: 'userValue' },
  { title: '实现难度', dataIndex: 'difficulty' },
  { title: '优先级', dataIndex: 'priority' },
  { title: '状态', dataIndex: 'status' },
  { title: '备注', dataIndex: 'notes' }
];

export const developmentTrackingColumns = [
  { title: '任务名称', dataIndex: 'name' },
  { title: '开发周期', dataIndex: 'period' },
  { title: '开始日期', dataIndex: 'startDate' },
  { title: '结束日期', dataIndex: 'endDate' },
  { title: '状态', dataIndex: 'status' },
  { title: '任务描述', dataIndex: 'description' }
];

export const testingChecklistColumns = [
  { title: '测试项', dataIndex: 'name' },
  { title: '测试类型', dataIndex: 'type' },
  { title: '优先级', dataIndex: 'priority' },
  { title: '状态', dataIndex: 'completed' },
  { title: '测试说明', dataIndex: 'description' }
];

export const asoKeywordsColumns = [
  { title: '关键词', dataIndex: 'keyword' },
  { title: '搜索量', dataIndex: 'searchVolume' },
  { title: '竞争程度', dataIndex: 'competition' }
];

export const exportAllData = () => {
  const allData = {
    exportDate: new Date().toLocaleString('zh-CN'),
    topicLibrary: {
      title: '选题库',
      data: JSON.parse(localStorage.getItem('topicLibrary') || '[]'),
      customFields: JSON.parse(localStorage.getItem('customFields') || '[]')
    },
    competitorAnalysis: {
      title: '竞品分析',
      data: JSON.parse(localStorage.getItem('competitorAnalysis') || '[]')
    },
    requirementMining: {
      title: '需求挖掘',
      data: JSON.parse(localStorage.getItem('requirementMining') || '[]')
    },
    developmentTasks: {
      title: '开发任务',
      data: JSON.parse(localStorage.getItem('developmentTasks') || '[]')
    },
    testingChecklists: {
      title: '测试清单',
      data: JSON.parse(localStorage.getItem('testingChecklists') || '[]')
    },
   asoKeywords: {
      title: 'ASO关键词',
      data: JSON.parse(localStorage.getItem('asoKeywords') || '[]'),
      appInfo: JSON.parse(localStorage.getItem('asoAppInfo') || '{}')
    },
    dataReview: {
      title: '数据复盘',
      data: JSON.parse(localStorage.getItem('dataReviewData') || '{}'),
      metrics: JSON.parse(localStorage.getItem('reviewMetrics') || '[]')
    }
  };
  
  const jsonString = JSON.stringify(allData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `App快速试错工具_完整数据_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportModuleToExcel = (moduleKey, moduleName) => {
  const storageKeyMap = {
    'topic-library': { dataKey: 'topicLibrary', columns: topicLibraryColumns },
    'competitor-analysis': { dataKey: 'competitorAnalysis', columns: competitorAnalysisColumns },
    'requirement-mining': { dataKey: 'requirementMining', columns: requirementMiningColumns },
    'development-tracking': { dataKey: 'developmentTasks', columns: developmentTrackingColumns },
    'testing-checklist': { dataKey: 'testingChecklists', columns: testingChecklistColumns }
  };
  
  const config = storageKeyMap[moduleKey];
  if (!config) {
    console.warn('Unknown module:', moduleKey);
    return;
  }
  
  const data = JSON.parse(localStorage.getItem(config.dataKey) || '[]');
  if (data.length === 0) {
    return false;
  }
  
  exportToExcel(data, `${moduleName}_${new Date().toISOString().split('T')[0]}`, config.columns);
  return true;
};
