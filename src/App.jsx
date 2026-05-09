import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Space, Tour, Modal, Dropdown, message } from 'antd';
import { 
  BookOutlined, 
  SearchOutlined, 
  TeamOutlined, 
  CodeOutlined, 
  CheckSquareOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  QuestionCircleOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import TopicLibrary from './components/TopicLibrary';
import CompetitorAnalysis from './components/CompetitorAnalysis';
import RequirementMining from './components/RequirementMining';
import DevelopmentTracking from './components/DevelopmentTracking';
import TestingChecklist from './components/TestingChecklist';
import ASOOptimization from './components/ASOOptimization';
import DataReview from './components/DataReview';
import { 
  exportModuleToExcel, 
  exportToCSV, 
  exportToJSON, 
  exportAllData,
  topicLibraryColumns,
  competitorAnalysisColumns,
  requirementMiningColumns,
  developmentTrackingColumns,
  testingChecklistColumns
} from './utils/exportUtils';
import './App.less';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [currentModule, setCurrentModule] = useState('topic-library');
  const [showTour, setShowTour] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const moduleDataMap = {
    'topic-library': {
      title: '选题库',
      dataKey: 'topicLibrary',
      columns: topicLibraryColumns
    },
    'competitor-analysis': {
      title: '竞品分析',
      dataKey: 'competitorAnalysis',
      columns: competitorAnalysisColumns
    },
    'requirement-mining': {
      title: '需求挖掘',
      dataKey: 'requirementMining',
      columns: requirementMiningColumns
    },
    'development-tracking': {
      title: '开发任务',
      dataKey: 'developmentTasks',
      columns: developmentTrackingColumns
    },
    'testing-checklist': {
      title: '测试清单',
      dataKey: 'testingChecklists',
      columns: testingChecklistColumns
    },
    'aso-optimization': {
      title: 'ASO关键词',
      dataKey: 'asoKeywords',
      columns: null
    },
    'data-review': {
      title: '数据复盘',
      dataKey: 'reviewMetrics',
      columns: null
    }
  };

  const getCurrentModuleData = () => {
    const config = moduleDataMap[currentModule];
    if (!config) return [];
    const data = localStorage.getItem(config.dataKey);
    return data ? JSON.parse(data) : [];
  };

  const handleExportModule = (format) => {
    const config = moduleDataMap[currentModule];
    if (!config) {
      message.warning('当前模块不支持导出');
      return;
    }

    const data = getCurrentModuleData();
    
    if (data.length === 0) {
      message.warning('当前模块暂无数据可导出');
      return;
    }

    const filename = `${config.title}_${new Date().toISOString().split('T')[0]}`;

    if (format === 'excel') {
      if (config.columns) {
        exportModuleToExcel(currentModule, config.title);
      } else {
        exportToJSON(Array.isArray(data) ? data : [data], filename);
      }
    } else if (format === 'csv') {
      if (config.columns) {
        exportToCSV(data, filename, config.columns);
      } else {
        exportToJSON(Array.isArray(data) ? data : [data], filename);
      }
    } else if (format === 'json') {
      exportToJSON(Array.isArray(data) ? data : [data], filename);
    }
  };

  const handleExportAll = (format) => {
    if (format === 'all') {
      exportAllData();
    } else {
      handleExportModule(format);
    }
  };

  const exportMenuItems = [
    {
      key: 'module',
      label: '导出当前模块',
      type: 'group',
      children: [
        {
          key: 'module-excel',
          icon: <FileExcelOutlined />,
          label: 'Excel 格式',
          onClick: () => handleExportModule('excel')
        },
        {
          key: 'module-csv',
          icon: <FileTextOutlined />,
          label: 'CSV 格式',
          onClick: () => handleExportModule('csv')
        },
        {
          key: 'module-json',
          icon: <CodeOutlined />,
          label: 'JSON 格式',
          onClick: () => handleExportModule('json')
        }
      ]
    },
    {
      key: 'divider1',
      type: 'divider'
    },
    {
      key: 'all',
      icon: <DatabaseOutlined />,
      label: '导出全部数据',
      onClick: () => handleExportAll('all')
    }
  ];

  const menuItems = [
    {
      key: 'topic-library',
      icon: <BookOutlined />,
      label: '选题库管理',
    },
    {
      key: 'competitor-analysis',
      icon: <SearchOutlined />,
      label: '竞品分析',
    },
    {
      key: 'requirement-mining',
      icon: <TeamOutlined />,
      label: '需求挖掘',
    },
    {
      key: 'development-tracking',
      icon: <CodeOutlined />,
      label: '开发进度管控',
    },
    {
      key: 'testing-checklist',
      icon: <CheckSquareOutlined />,
      label: '测试清单生成',
    },
    {
      key: 'aso-optimization',
      icon: <BarChartOutlined />,
      label: 'ASO优化辅助',
    },
    {
      key: 'data-review',
      icon: <SettingOutlined />,
      label: '数据复盘',
    },
  ];

  const tourSteps = [
    {
      title: '欢迎使用App快速试错工具',
      description: '本工具将帮助您按照"关键词驱动+两周闭环+数据导向"的方法论，高效完成App开发试错流程。',
      target: () => document.querySelector('.app-header')
    },
    {
      title: '核心功能模块',
      description: '左侧是7大核心功能模块，所有模块现已开放使用。',
      target: () => document.querySelector('.app-sider')
    },
    {
      title: '选题库管理',
      description: '从选题库开始，录入您的App关键词，标注指标并排序优先级。',
      target: () => document.querySelector('.ant-menu-item:first-child')
    },
    {
      title: '数据导出',
      description: '您可以随时将数据导出为Excel、CSV或Notion格式。',
      target: () => document.querySelector('.export-button')
    }
  ];

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowTour(true);
    }
  }, []);

  const handleTourStart = () => {
    setTourOpen(true);
  };

  const handleTourClose = () => {
    setTourOpen(false);
    localStorage.setItem('hasVisited', 'true');
  };

  const renderModule = () => {
    switch (currentModule) {
      case 'topic-library':
        return <TopicLibrary />;
      case 'competitor-analysis':
        return <CompetitorAnalysis />;
      case 'requirement-mining':
        return <RequirementMining />;
      case 'development-tracking':
        return <DevelopmentTracking />;
      case 'testing-checklist':
        return <TestingChecklist />;
      case 'aso-optimization':
        return <ASOOptimization />;
      case 'data-review':
        return <DataReview />;
      default:
        return <div>模块开发中...</div>;
    }
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-content">
          <Title level={3} style={{ color: 'white', margin: 0 }}>App快速试错工具</Title>
          <Space>
            <Button 
              type="primary" 
              onClick={handleTourStart}
              icon={<QuestionCircleOutlined />}
            >
              新手引导
            </Button>
            <Dropdown 
              menu={{ items: exportMenuItems }}
              className="export-button"
              trigger={['click']}
            >
              <Button icon={<DownloadOutlined />}>
                导出数据
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="app-sider">
          <Menu
            mode="inline"
            selectedKeys={[currentModule]}
            items={menuItems}
            onClick={({ key }) => setCurrentModule(key)}
          />
        </Sider>
        <Content className="app-content">
          {renderModule()}
        </Content>
      </Layout>
      <Tour 
        open={tourOpen} 
        onClose={handleTourClose} 
        steps={tourSteps} 
      />
    </Layout>
  );
};

export default App;