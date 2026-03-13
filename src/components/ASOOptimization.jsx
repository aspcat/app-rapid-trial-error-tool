import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Space, 
  Typography,
  Tag,
  Modal,
  List,
  Popover,
  Rate,
  Divider,
  Row,
  Col,
  Statistic,
  Progress
} from 'antd';
import { 
  InfoCircleOutlined,
  HighlightOutlined,
  PictureOutlined,
  BarChartOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './ASOOptimization.less';

const { Title, Text, Paragraph } = Typography;

const ASOOptimization = () => {
  const [form] = Form.useForm();
  const [isMethodologyVisible, setIsMethodologyVisible] = useState(false);
  const [appInfo, setAppInfo] = useState({});
  const [keywords, setKeywords] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 方法论说明
  const methodologyContent = (
    <div className="methodology-content">
      <Title level={4}>ASO优化辅助方法论</Title>
      <Text>
        <p>1. 标题优化：包含核心关键词，控制在30个字符以内</p>
        <p>2. 副标题优化：补充说明App功能和特点</p>
        <p>3. 关键词优化：选择高搜索量、低竞争的关键词</p>
        <p>4. 截图优化：展示核心功能，添加说明文字</p>
        <p>5. 描述优化：突出App亮点，使用关键词</p>
      </Text>
    </div>
  );

  // 加载数据
  useEffect(() => {
    const savedAppInfo = localStorage.getItem('asoAppInfo');
    if (savedAppInfo) {
      try {
        const parsedAppInfo = JSON.parse(savedAppInfo);
        setAppInfo(parsedAppInfo);
        form.setFieldsValue(parsedAppInfo);
      } catch (e) {
        console.error('Failed to parse asoAppInfo from localStorage', e);
        setAppInfo({});
      }
    }
    
    const savedKeywords = localStorage.getItem('asoKeywords');
    if (savedKeywords) {
      try {
        setKeywords(JSON.parse(savedKeywords));
      } catch (e) {
        console.error('Failed to parse asoKeywords from localStorage', e);
        setKeywords([]);
      }
    }
    
    const savedScreenshots = localStorage.getItem('asoScreenshots');
    if (savedScreenshots) {
      try {
        setScreenshots(JSON.parse(savedScreenshots));
      } catch (e) {
        console.error('Failed to parse asoScreenshots from localStorage', e);
        setScreenshots([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存数据
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('asoAppInfo', JSON.stringify(appInfo));
    }
  }, [appInfo, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('asoKeywords', JSON.stringify(keywords));
    }
  }, [keywords, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('asoScreenshots', JSON.stringify(screenshots));
    }
  }, [screenshots, isLoaded]);

  // 计算优化得分
  useEffect(() => {
    let score = 0;
    
    // 标题优化 (30分)
    if (appInfo.title) {
      score += appInfo.title.length <= 30 ? 30 : 20;
    }
    
    // 副标题优化 (20分)
    if (appInfo.subtitle) {
      score += appInfo.subtitle.length <= 50 ? 20 : 10;
    }
    
    // 关键词优化 (30分)
    if (keywords.length > 0) {
      score += Math.min(keywords.length * 5, 30);
    }
    
    // 截图优化 (20分)
    if (screenshots.length > 0) {
      score += Math.min(screenshots.length * 4, 20);
    }
    
    setOptimizationScore(score);
  }, [appInfo, keywords, screenshots]);

  const handleFinish = (values) => {
    setAppInfo(values);
  };

  const handleAddKeyword = () => {
    Modal.confirm({
      title: '添加关键词',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item 
            name="newKeyword" 
            label="关键词" 
            rules={[{ required: true, message: '请输入关键词' }]}
          >
            <Input placeholder="例如：在线教育、健康管理" />
          </Form.Item>
          <Form.Item 
            name="searchVolume" 
            label="搜索量(1-10)" 
            rules={[{ required: true, message: '请选择搜索量' }]}
          >
            <Rate count={10} />
          </Form.Item>
          <Form.Item 
            name="competition" 
            label="竞争程度(1-10)" 
            rules={[{ required: true, message: '请选择竞争程度' }]}
          >
            <Rate count={10} />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        form.validateFields(['newKeyword', 'searchVolume', 'competition']).then(values => {
          const newKeyword = {
            id: Date.now(),
            keyword: values.newKeyword,
            searchVolume: values.searchVolume,
            competition: values.competition
          };
          setKeywords([...keywords, newKeyword]);
          form.resetFields(['newKeyword', 'searchVolume', 'competition']);
        });
      }
    });
  };

  const handleDeleteKeyword = (id) => {
    setKeywords(keywords.filter(keyword => keyword.id !== id));
  };

  const handleAddScreenshot = () => {
    Modal.confirm({
      title: '添加截图说明',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item 
            name="screenshotDesc" 
            label="截图说明" 
            rules={[{ required: true, message: '请输入截图说明' }]}
          >
            <Input.TextArea placeholder="例如：展示核心功能界面" rows={3} />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        form.validateFields(['screenshotDesc']).then(values => {
          const newScreenshot = {
            id: Date.now(),
            description: values.screenshotDesc
          };
          setScreenshots([...screenshots, newScreenshot]);
          form.resetFields(['screenshotDesc']);
        });
      }
    });
  };

  const handleDeleteScreenshot = (id) => {
    setScreenshots(screenshots.filter(screenshot => screenshot.id !== id));
  };

  const getScoreLevel = (score) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '待优化';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#1890ff';
    if (score >= 40) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div className="aso-optimization">
      <Card className="aso-optimization-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              ASO优化辅助
              <Popover content={methodologyContent} title="方法论指导" trigger="hover">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
              </Popover>
            </Title>
            <Text type="secondary">提供标题、副标题优化建议，截图优化指导</Text>
          </div>
        </div>
      </Card>

      <Row gutter={24} className="stats-row">
        <Col span={8}>
          <Card>
            <Statistic
              title="ASO优化得分"
              value={optimizationScore}
              suffix="/ 100"
              valueStyle={{ color: getScoreColor(optimizationScore) }}
            />
            <div className="score-level">{getScoreLevel(optimizationScore)}</div>
            <Progress 
              percent={optimizationScore} 
              strokeColor={getScoreColor(optimizationScore)} 
              showInfo={false} 
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="关键词数量"
              value={keywords.length}
              suffix="个"
            />
            <div className="score-level">建议5-10个</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="截图说明"
              value={screenshots.length}
              suffix="张"
            />
            <div className="score-level">建议3-5张</div>
          </Card>
        </Col>
      </Row>

      <Card className="form-card">
        <Title level={5} style={{ margin: '0 0 16px 0' }}>
          <HighlightOutlined style={{ marginRight: 8 }} />
          App基本信息优化
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={appInfo}
        >
          <Form.Item 
            name="title" 
            label="App标题" 
            rules={[{ required: true, message: '请输入App标题' }]}
          >
            <Input placeholder="例如：健康管理专家 - 记录你的健康数据" />
          </Form.Item>
          
          <Form.Item 
            name="subtitle" 
            label="副标题"
          >
            <Input placeholder="例如：全面记录健康数据，提供专业分析建议" />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="App描述"
          >
            <Input.TextArea placeholder="请输入App详细描述" rows={4} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存基本信息
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      <Card className="keywords-card">
        <div className="section-header">
          <Title level={5} style={{ margin: 0 }}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            关键词优化
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddKeyword}
          >
            添加关键词
          </Button>
        </div>
        
        <List
          dataSource={keywords}
          renderItem={item => (
            <List.Item
              actions={[
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  key="edit"
                >
                  编辑
                </Button>,
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  key="delete"
                  danger
                  onClick={() => handleDeleteKeyword(item.id)}
                >
                  删除
                </Button>
              ]}
            >
              <List.Item.Meta
                title={item.keyword}
                description={
                  <Space>
                    <Text>搜索量: </Text>
                    <Rate disabled defaultValue={item.searchVolume} count={10} />
                    <Text>竞争度: </Text>
                    <Rate disabled defaultValue={item.competition} count={10} />
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Divider />

      <Card className="screenshots-card">
        <div className="section-header">
          <Title level={5} style={{ margin: 0 }}>
            <PictureOutlined style={{ marginRight: 8 }} />
            截图优化指导
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddScreenshot}
          >
            添加截图说明
          </Button>
        </div>
        
        <div className="screenshots-container">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div key={item} className="screenshot-item">
              <div className="screenshot-placeholder">
                <FileImageOutlined style={{ fontSize: 32, color: '#ccc' }} />
                <div>截图 {index + 1}</div>
              </div>
              {screenshots[index] ? (
                <div className="screenshot-desc">
                  <Paragraph ellipsis={{ rows: 2 }}>
                    {screenshots[index].description}
                  </Paragraph>
                  <Button 
                    type="link" 
                    icon={<DeleteOutlined />} 
                    danger
                    onClick={() => handleDeleteScreenshot(screenshots[index].id)}
                    size="small"
                  >
                    删除
                  </Button>
                </div>
              ) : (
                <div className="screenshot-desc empty">
                  未添加说明
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Modal
        title="方法论指导"
        open={isMethodologyVisible}
        onCancel={() => setIsMethodologyVisible(false)}
        footer={null}
        width={600}
      >
        {methodologyContent}
      </Modal>
    </div>
  );
};

export default ASOOptimization;