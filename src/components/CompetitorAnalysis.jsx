import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Typography,
  Card,
  Tag,
  Popover,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import './CompetitorAnalysis.less';

const { Title, Text } = Typography;
const { Option } = Select;

const CompetitorAnalysis = () => {
  const [competitors, setCompetitors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState(null);
  const [form] = Form.useForm();
  const [isLoaded, setIsLoaded] = useState(false);

  // 方法论说明
  const methodologyContent = (
    <div className="methodology-content">
      <Title level={4}>竞品分析方法论</Title>
      <Text>
        <p>1. 选择3-5个直接竞品和1-2个间接竞品进行分析</p>
        <p>2. 重点关注核心功能、用户体验、商业模式</p>
        <p>3. 识别竞品的优势和不足，寻找差异化机会</p>
        <p>4. 为后续需求挖掘和产品设计提供参考</p>
      </Text>
    </div>
  );

  const columns = [
    {
      title: '竞品名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '直接竞品', value: 'direct' },
        { text: '间接竞品', value: 'indirect' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (text) => (
        <Tag color={text === 'direct' ? 'blue' : 'orange'}>
          {text === 'direct' ? '直接竞品' : '间接竞品'}
        </Tag>
      )
    },
    {
      title: '核心功能',
      dataIndex: 'coreFeatures',
      key: 'coreFeatures',
      ellipsis: true,
    },
    {
      title: '优势',
      dataIndex: 'strengths',
      key: 'strengths',
      ellipsis: true,
    },
    {
      title: '不足',
      dataIndex: 'weaknesses',
      key: 'weaknesses',
      ellipsis: true,
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      render: (text) => (
        <Tag color={text > 8 ? 'green' : text > 6 ? 'orange' : 'red'}>
          {text}/10
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
            size="small"
            danger
          />
        </Space>
      ),
    },
  ];

  // 加载数据
  useEffect(() => {
    const savedCompetitors = localStorage.getItem('competitorAnalysis');
    if (savedCompetitors) {
      try {
        setCompetitors(JSON.parse(savedCompetitors));
      } catch (e) {
        console.error('Failed to parse competitorAnalysis from localStorage', e);
        setCompetitors([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存数据
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('competitorAnalysis', JSON.stringify(competitors));
    }
  }, [competitors, isLoaded]);

  const handleAdd = () => {
    setEditingCompetitor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCompetitor(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setCompetitors(competitors.filter(competitor => competitor.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingCompetitor) {
        // 编辑
        setCompetitors(competitors.map(competitor => 
          competitor.id === editingCompetitor.id ? { ...values, id: editingCompetitor.id } : competitor
        ));
      } else {
        // 新增
        const newCompetitor = { ...values, id: Date.now() };
        setCompetitors([...competitors, newCompetitor]);
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportTemplate = () => {
    // 实际应用中这里会生成并下载模板文件
    Modal.info({
      title: '竞品分析模板',
      content: (
        <div>
          <p>竞品分析模板包含以下字段：</p>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Divider orientation="left">基本信息</Divider>
              <ul>
                <li>竞品名称</li>
                <li>类型（直接/间接）</li>
                <li>官网链接</li>
              </ul>
            </Col>
            <Col span={12}>
              <Divider orientation="left">分析维度</Divider>
              <ul>
                <li>核心功能</li>
                <li>主要优势</li>
                <li>明显不足</li>
                <li>综合评分(1-10)</li>
              </ul>
            </Col>
          </Row>
        </div>
      )
    });
  };

  return (
    <div className="competitor-analysis">
      <Card className="competitor-analysis-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              竞品分析
              <Popover content={methodologyContent} title="方法论指导" trigger="hover">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
              </Popover>
            </Title>
            <Text type="secondary">分析竞争对手，寻找差异化机会点</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加竞品
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExportTemplate}
            >
              分析模板
            </Button>
          </Space>
        </div>
      </Card>

      <Table
        dataSource={competitors}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="competitor-table"
      />

      <Modal
        title={editingCompetitor ? "编辑竞品" : "添加竞品"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name" 
                label="竞品名称" 
                rules={[{ required: true, message: '请输入竞品名称' }]}
              >
                <Input placeholder="例如：小红书、抖音、微博" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="type" 
                label="竞品类型" 
                rules={[{ required: true, message: '请选择竞品类型' }]}
              >
                <Select placeholder="请选择竞品类型">
                  <Option value="direct">直接竞品</Option>
                  <Option value="indirect">间接竞品</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="url" 
            label="官网链接"
          >
            <Input placeholder="例如：https://www.xiaohongshu.com" />
          </Form.Item>
          
          <Form.Item 
            name="coreFeatures" 
            label="核心功能"
            rules={[{ required: true, message: '请输入核心功能' }]}
          >
            <Input.TextArea placeholder="描述该竞品的核心功能，多个功能用逗号分隔" rows={3} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="strengths" 
                label="主要优势"
                rules={[{ required: true, message: '请输入主要优势' }]}
              >
                <Input.TextArea placeholder="描述该竞品的主要优势" rows={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="weaknesses" 
                label="明显不足"
                rules={[{ required: true, message: '请输入明显不足' }]}
              >
                <Input.TextArea placeholder="描述该竞品的明显不足" rows={3} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="score" 
            label="综合评分 (1-10)" 
            rules={[{ required: true, message: '请选择综合评分' }]}
          >
            <Select placeholder="请选择综合评分">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <Option key={num} value={num}>{num}分</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompetitorAnalysis;