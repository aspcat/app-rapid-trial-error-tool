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
  List,
  Collapse
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  DownloadOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './RequirementMining.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const RequirementMining = () => {
  const [requirements, setRequirements] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [form] = Form.useForm();
  const [isDataReady, setIsDataReady] = useState(false);

  // 方法论说明
  const methodologyContent = (
    <div className="methodology-content">
      <Title level={4}>需求挖掘方法论</Title>
      <Text>
        <p>1. 多渠道收集用户需求：用户访谈、问卷调研、应用商店评论等</p>
        <p>2. 分类整理需求：核心需求、重要需求、一般需求</p>
        <p>3. 评估需求价值：结合用户价值和实现难度</p>
        <p>4. 形成需求池：为后续产品设计和开发提供输入</p>
      </Text>
    </div>
  );

  // 需求收集渠道
  const collectionChannels = [
    {
      key: 'interview',
      name: '用户访谈',
      description: '深度了解用户痛点和使用场景'
    },
    {
      key: 'survey',
      name: '问卷调研',
      description: '快速收集大量用户反馈'
    },
    {
      key: 'review',
      name: '应用商店评论',
      description: '分析用户对竞品的真实评价'
    },
    {
      key: 'community',
      name: '社区讨论',
      description: '关注相关论坛和社交媒体讨论'
    },
    {
      key: 'analytics',
      name: '数据分析',
      description: '通过用户行为数据分析需求'
    }
  ];

  const columns = [
    {
      title: '需求描述',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: '来源渠道',
      dataIndex: 'source',
      key: 'source',
      filters: collectionChannels.map(channel => ({
        text: channel.name,
        value: channel.key
      })),
      onFilter: (value, record) => record.source === value,
      render: (text) => {
        const channel = collectionChannels.find(c => c.key === text);
        return channel ? channel.name : text;
      }
    },
    {
      title: '用户价值',
      dataIndex: 'userValue',
      key: 'userValue',
      sorter: (a, b) => a.userValue - b.userValue,
      render: (text) => (
        <Tag color={text > 7 ? 'green' : text > 4 ? 'orange' : 'red'}>
          {text}/10
        </Tag>
      )
    },
    {
      title: '实现难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      sorter: (a, b) => a.difficulty - b.difficulty,
      render: (text) => (
        <Tag color={text > 7 ? 'red' : text > 4 ? 'orange' : 'green'}>
          {text}/10
        </Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority - b.priority,
      render: (text) => {
        let color = 'red';
        let textLabel = '一般';
        if (text > 7) {
          color = 'green';
          textLabel = '核心';
        } else if (text > 4) {
          color = 'orange';
          textLabel = '重要';
        }
        return <Tag color={color}>{textLabel}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '待评估', value: 'pending' },
        { text: '已确认', value: 'confirmed' },
        { text: '已拒绝', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => {
        let color = 'default';
        let icon = null;
        if (text === 'confirmed') {
          color = 'green';
          icon = <CheckOutlined />;
        } else if (text === 'rejected') {
          color = 'red';
          icon = <CloseOutlined />;
        }
        return <Tag color={color} icon={icon}>{text === 'pending' ? '待评估' : text === 'confirmed' ? '已确认' : '已拒绝'}</Tag>;
      }
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
    const savedRequirements = localStorage.getItem('requirementMining');
    if (savedRequirements) {
      try {
        setRequirements(JSON.parse(savedRequirements));
      } catch (e) {
        console.error('Failed to parse requirementMining from localStorage', e);
        setRequirements([]);
      }
    }
    setIsDataReady(true);
  }, []);

  // 保存数据
  useEffect(() => {
    if (!isDataReady) return;
    localStorage.setItem('requirementMining', JSON.stringify(requirements));
  }, [requirements, isDataReady]);

  const handleAdd = () => {
    setEditingRequirement(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRequirement(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setRequirements(requirements.filter(requirement => requirement.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingRequirement) {
        // 编辑
        setRequirements(requirements.map(requirement => 
          requirement.id === editingRequirement.id ? { ...values, id: editingRequirement.id } : requirement
        ));
      } else {
        // 新增
        const newRequirement = { ...values, id: Date.now(), status: 'pending' };
        setRequirements([...requirements, newRequirement]);
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
      title: '需求收集模板',
      content: (
        <div>
          <p>需求收集模板包含以下字段：</p>
          <List
            size="small"
            dataSource={[
              '需求描述',
              '来源渠道',
              '用户价值(1-10)',
              '实现难度(1-10)',
              '优先级(核心/重要/一般)',
              '备注信息'
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </div>
      )
    });
  };

  return (
    <div className="requirement-mining">
      <Card className="requirement-mining-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              需求挖掘
              <Popover content={methodologyContent} title="方法论指导" trigger="hover">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
              </Popover>
            </Title>
            <Text type="secondary">收集和整理用户需求，形成需求池</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加需求
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExportTemplate}
            >
              收集模板
            </Button>
          </Space>
        </div>
      </Card>

      <Collapse defaultActiveKey={['1']} className="requirement-collapse">
        <Panel header="需求收集渠道说明" key="1">
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={collectionChannels}
            renderItem={item => (
              <List.Item>
                <Card title={item.name} size="small">
                  <p>{item.description}</p>
                </Card>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>

      <Table
        dataSource={requirements}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="requirement-table"
        style={{ marginTop: 24 }}
      />

      <Modal
        title={editingRequirement ? "编辑需求" : "添加需求"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="description" 
            label="需求描述" 
            rules={[{ required: true, message: '请输入需求描述' }]}
          >
            <Input.TextArea placeholder="详细描述用户需求或痛点" rows={3} />
          </Form.Item>
          
          <Form.Item 
            name="source" 
            label="来源渠道" 
            rules={[{ required: true, message: '请选择来源渠道' }]}
          >
            <Select placeholder="请选择需求来源渠道">
              {collectionChannels.map(channel => (
                <Option key={channel.key} value={channel.key}>{channel.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="notes" 
            label="备注信息"
          >
            <Input.TextArea placeholder="其他相关信息" rows={2} />
          </Form.Item>
          
          <Form.Item 
            name="userValue" 
            label="用户价值 (1-10)" 
            rules={[{ required: true, message: '请选择用户价值' }]}
          >
            <Select placeholder="请选择用户价值评分">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <Option key={num} value={num}>{num}分</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="difficulty" 
            label="实现难度 (1-10)" 
            rules={[{ required: true, message: '请选择实现难度' }]}
          >
            <Select placeholder="请选择实现难度评分">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <Option key={num} value={num}>{num}分</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="priority" 
            label="优先级" 
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择需求优先级">
              <Option value={9}>核心需求</Option>
              <Option value={6}>重要需求</Option>
              <Option value={3}>一般需求</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RequirementMining;
