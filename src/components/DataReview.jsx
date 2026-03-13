import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  Space, 
  Typography,
  Tag,
  Modal,
  List,
  Popover,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Select
} from 'antd';
import { 
  InfoCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DownloadOutlined,
  PrinterOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './DataReview.less';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const DataReview = () => {
  const [form] = Form.useForm();
  const [isMethodologyVisible, setIsMethodologyVisible] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const [metrics, setMetrics] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportContent, setReportContent] = useState('');

  // 方法论说明
  const methodologyContent = (
    <div className="methodology-content">
      <Title level={4}>数据复盘方法论</Title>
      <Text>
        <p>1. 数据录入：记录关键业务指标和用户反馈</p>
        <p>2. 自动分级：根据预设标准对数据进行分级评估</p>
        <p>3. 趋势分析：对比不同周期的数据变化趋势</p>
        <p>4. 问题识别：识别数据异常和潜在问题</p>
        <p>5. 改进建议：基于数据分析提出优化建议</p>
      </Text>
    </div>
  );

  // 默认指标
  const defaultMetrics = [
    { id: 1, name: '用户活跃度', category: 'user', weight: 20, currentValue: 0, targetValue: 0 },
    { id: 2, name: '留存率', category: 'user', weight: 15, currentValue: 0, targetValue: 0 },
    { id: 3, name: '转化率', category: 'business', weight: 20, currentValue: 0, targetValue: 0 },
    { id: 4, name: '收入增长', category: 'business', weight: 15, currentValue: 0, targetValue: 0 },
    { id: 5, name: '用户满意度', category: 'user', weight: 10, currentValue: 0, targetValue: 0 },
    { id: 6, name: '功能使用率', category: 'product', weight: 10, currentValue: 0, targetValue: 0 },
    { id: 7, name: 'Bug修复率', category: 'product', weight: 10, currentValue: 0, targetValue: 0 }
  ];

  // 加载数据
  useEffect(() => {
    const savedReviewData = localStorage.getItem('dataReviewData');
    if (savedReviewData) {
      try {
        const parsedReviewData = JSON.parse(savedReviewData);
        setReviewData(parsedReviewData);
        form.setFieldsValue(parsedReviewData);
      } catch (e) {
        console.error('Failed to parse dataReviewData from localStorage', e);
        setReviewData({});
      }
    }
    
    const savedMetrics = localStorage.getItem('reviewMetrics');
    if (savedMetrics) {
      try {
        setMetrics(JSON.parse(savedMetrics));
      } catch (e) {
        console.error('Failed to parse reviewMetrics from localStorage', e);
        setMetrics(defaultMetrics);
      }
    } else {
      setMetrics(defaultMetrics);
    }
    setIsLoaded(true);
  }, []);

  // 保存数据
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dataReviewData', JSON.stringify(reviewData));
    }
  }, [reviewData, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('reviewMetrics', JSON.stringify(metrics));
    }
  }, [metrics, isLoaded]);

  const handleFinish = (values) => {
    setReviewData(values);
  };

  const handleAddMetric = () => {
    Modal.confirm({
      title: '添加自定义指标',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item 
            name="metricName" 
            label="指标名称" 
            rules={[{ required: true, message: '请输入指标名称' }]}
          >
            <Input placeholder="例如：功能使用率" />
          </Form.Item>
          <Form.Item 
            name="metricCategory" 
            label="指标分类" 
            rules={[{ required: true, message: '请选择指标分类' }]}
          >
            <Select placeholder="请选择指标分类">
              <Option value="user">用户指标</Option>
              <Option value="business">业务指标</Option>
              <Option value="product">产品指标</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="metricWeight" 
            label="权重(1-30)" 
            rules={[{ required: true, message: '请输入权重' }]}
          >
            <InputNumber min={1} max={30} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        form.validateFields(['metricName', 'metricCategory', 'metricWeight']).then(values => {
          const newMetric = {
            id: Date.now(),
            name: values.metricName,
            category: values.metricCategory,
            weight: values.metricWeight,
            currentValue: 0,
            targetValue: 0
          };
          setMetrics([...metrics, newMetric]);
          form.resetFields(['metricName', 'metricCategory', 'metricWeight']);
        });
      }
    });
  };

  const handleDeleteMetric = (id) => {
    setMetrics(metrics.filter(metric => metric.id !== id));
  };

  const handleUpdateMetric = (id, field, value) => {
    setMetrics(metrics.map(metric => 
      metric.id === id ? { ...metric, [field]: value } : metric
    ));
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'user': return '用户指标';
      case 'business': return '业务指标';
      case 'product': return '产品指标';
      default: return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'user': return 'blue';
      case 'business': return 'green';
      case 'product': return 'orange';
      default: return 'default';
    }
  };

  const getPerformanceLevel = (current, target) => {
    if (current >= target) return { level: '优秀', color: '#52c41a' };
    if (current >= target * 0.8) return { level: '良好', color: '#1890ff' };
    if (current >= target * 0.6) return { level: '一般', color: '#faad14' };
    return { level: '待改进', color: '#ff4d4f' };
  };

  const calculateTotalScore = () => {
    const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
    const weightedScore = metrics.reduce((sum, metric) => {
      if (metric.targetValue === 0) return sum;
      const performance = metric.currentValue / metric.targetValue;
      return sum + (performance * metric.weight);
    }, 0);
    
    return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
  };

  const totalScore = calculateTotalScore();

  const generateReport = () => {
    let report = `# 数据复盘报告\n\n`;
    report += `## 基本信息\n`;
    report += `复盘周期: ${reviewData.period || '未填写'}\n`;
    report += `负责人: ${reviewData.owner || '未填写'}\n`;
    report += `复盘日期: ${reviewData.date || '未填写'}\n\n`;
    
    report += `## 核心指标概览\n`;
    report += `总体得分: ${totalScore}/100\n\n`;
    
    report += `## 详细指标分析\n`;
    metrics.forEach(metric => {
      const performance = getPerformanceLevel(metric.currentValue, metric.targetValue);
      report += `### ${metric.name}\n`;
      report += `- 分类: ${getCategoryName(metric.category)}\n`;
      report += `- 权重: ${metric.weight}%\n`;
      report += `- 当前值: ${metric.currentValue}\n`;
      report += `- 目标值: ${metric.targetValue}\n`;
      report += `- 表现: ${performance.level}\n\n`;
    });
    
    report += `## 总结与建议\n`;
    report += reviewData.summary || '未填写总结与建议';
    
    setReportContent(report);
    setIsReportModalVisible(true);
  };

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          {record.name}
          <Tag color={getCategoryColor(record.category)}>
            {getCategoryName(record.category)}
          </Tag>
        </Space>
      )
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      render: (text) => `${text}%`
    },
    {
      title: '当前值',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (_, record) => (
        <InputNumber 
          value={record.currentValue} 
          onChange={value => handleUpdateMetric(record.id, 'currentValue', value)}
          style={{ width: 80 }}
        />
      )
    },
    {
      title: '目标值',
      dataIndex: 'targetValue',
      key: 'targetValue',
      render: (_, record) => (
        <InputNumber 
          value={record.targetValue} 
          onChange={value => handleUpdateMetric(record.id, 'targetValue', value)}
          style={{ width: 80 }}
        />
      )
    },
    {
      title: '表现',
      dataIndex: 'performance',
      key: 'performance',
      render: (_, record) => {
        if (record.targetValue === 0) return <Text type="secondary">未设置目标</Text>;
        const performance = getPerformanceLevel(record.currentValue, record.targetValue);
        return <Tag color={performance.color}>{performance.level}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<DeleteOutlined />} 
          danger
          onClick={() => handleDeleteMetric(record.id)}
        >
          删除
        </Button>
      ),
    }
  ];

  return (
    <div className="data-review">
      <Card className="data-review-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              数据复盘
              <Popover content={methodologyContent} title="方法论指导" trigger="hover">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
              </Popover>
            </Title>
            <Text type="secondary">支持录入数据，自动分级功能，生成复盘报告</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<BarChartOutlined />} 
              onClick={generateReport}
            >
              生成报告
            </Button>
          </Space>
        </div>
      </Card>

      <Row gutter={24} className="stats-row">
        <Col span={8}>
          <Card>
            <Statistic
              title="复盘得分"
              value={totalScore}
              suffix="/ 100"
              valueStyle={{ color: totalScore >= 80 ? '#52c41a' : totalScore >= 60 ? '#1890ff' : '#faad14' }}
            />
            <Progress 
              percent={totalScore} 
              strokeColor={totalScore >= 80 ? '#52c41a' : totalScore >= 60 ? '#1890ff' : '#faad14'} 
              showInfo={false} 
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="指标数量"
              value={metrics.length}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均权重"
              value={metrics.length > 0 ? (metrics.reduce((sum, m) => sum + m.weight, 0) / metrics.length).toFixed(1) : 0}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Card className="form-card">
        <Title level={5} style={{ margin: '0 0 16px 0' }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          复盘基本信息
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={reviewData}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item 
                name="period" 
                label="复盘周期" 
                rules={[{ required: true, message: '请输入复盘周期' }]}
              >
                <Input placeholder="例如：2023年Q1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="owner" 
                label="负责人" 
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="date" 
                label="复盘日期" 
                rules={[{ required: true, message: '请输入复盘日期' }]}
              >
                <Input placeholder="例如：2023-04-01" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="summary" 
            label="总结与建议"
          >
            <Input.TextArea placeholder="请输入本次复盘的总结与改进建议" rows={4} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存基本信息
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      <Card className="metrics-card">
        <div className="section-header">
          <Title level={5} style={{ margin: 0 }}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            核心指标管理
          </Title>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddMetric}
            >
              添加指标
            </Button>
          </Space>
        </div>
        
        <Table
          dataSource={metrics}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="metrics-table"
        />
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

      <Modal
        title="复盘报告"
        open={isReportModalVisible}
        onCancel={() => setIsReportModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsReportModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="print" 
            type="primary" 
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            打印报告
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => {
              const blob = new Blob([reportContent], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `数据复盘报告_${reviewData.period || '未命名'}.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            下载报告
          </Button>
        ]}
      >
        <div className="report-content">
          <pre>{reportContent}</pre>
        </div>
      </Modal>
    </div>
  );
};

export default DataReview;