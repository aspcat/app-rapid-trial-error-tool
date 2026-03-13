import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Space, Tour, Modal } from 'antd';
import { 
  BookOutlined, 
  SearchOutlined, 
  TeamOutlined, 
  CodeOutlined, 
  CheckSquareOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import TopicLibrary from './components/TopicLibrary';
import CompetitorAnalysis from './components/CompetitorAnalysis';
import RequirementMining from './components/RequirementMining';
import DevelopmentTracking from './components/DevelopmentTracking';
import TestingChecklist from './components/TestingChecklist';
import ASOOptimization from './components/ASOOptimization';
import DataReview from './components/DataReview';
import './App.less';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [currentModule, setCurrentModule] = useState('topic-library');
  const [showTour, setShowTour] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

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

  const handleExport = (format) => {
    Modal.info({
      title: '导出功能说明',
      content: (
        <div>
          <p>您选择导出为 {format} 格式</p>
          <p>实际应用中，这里将执行导出逻辑</p>
        </div>
      )
    });
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
            <Button 
              className="export-button"
              onClick={() => handleExport('Excel')}
            >
              导出数据
            </Button>
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