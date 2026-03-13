import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Form, 
  Input, 
  Select, 
  Space, 
  Typography,
  Tag,
  Modal,
  List,
  Popover,
  Checkbox,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  CheckSquareOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import './TestingChecklist.less';

const { Title, Text } = Typography;
const { Option } = Select;

const TestingChecklist = () => {
  const [checklists, setChecklists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [form] = Form.useForm();
  const [isMethodologyVisible, setIsMethodologyVisible] = useState(false);
  const [testItems, setTestItems] = useState([]);

  // 方法论说明
  const methodologyContent = (
    <div className="methodology-content">
      <Title level={4}>测试清单生成方法论</Title>
      <Text>
        <p>1. 自动生成标准化测试项：基于App类型自动生成核心功能测试项</p>
        <p>2. 支持自定义测试项：允许添加特定业务场景的测试项</p>
        <p>3. 支持勾选确认完成状态：可视化跟踪测试进度</p>
        <p>4. 分类管理：按功能模块分类管理测试项</p>
      </Text>
    </div>
  );

  const columns = [
    {
      title: '测试项',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '测试类型',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (text) => {
        const typeMap = {
          'functional': { color: 'blue', text: '功能测试' },
          'ui': { color: 'green', text: 'UI测试' },
          'compatibility': { color: 'orange', text: '兼容性测试' },
          'performance': { color: 'purple', text: '性能测试' },
          'security': { color: 'red', text: '安全测试' }
        };
        return <Tag color={typeMap[text]?.color}>{typeMap[text]?.text}</Tag>;
      }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority - b.priority,
      render: (text) => {
        const priorityMap = {
          1: { color: 'red', text: '高' },
          2: { color: 'orange', text: '中' },
          3: { color: 'green', text: '低' }
        };
        return <Tag color={priorityMap[text]?.color}>{priorityMap[text]?.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'completed',
      key: 'completed',
      sorter: (a, b) => a.completed - b.completed,
      render: (text, record) => (
        <Checkbox 
          checked={text} 
          onChange={(e) => handleStatusChange(record.id, e.target.checked)}
        >
          {text ? '已完成' : '未完成'}
        </Checkbox>
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
    }
  ];

  // 加载数据
  useEffect(() => {
    const savedChecklists = localStorage.getItem('testingChecklists');
    if (savedChecklists) {
      try {
        setChecklists(JSON.parse(savedChecklists));
      } catch (e) {
        console.error('Failed to parse testingChecklists from localStorage', e);
        setChecklists([]);
      }
    }
    
    // 初始化默认测试项
    const defaultItems = [
      { id: 1, name: '用户注册功能测试', type: 'functional', priority: 1, completed: false },
      { id: 2, name: '用户登录功能测试', type: 'functional', priority: 1, completed: false },
      { id: 3, name: '核心功能流程测试', type: 'functional', priority: 1, completed: false },
      { id: 4, name: 'UI界面在不同设备上的显示效果', type: 'ui', priority: 2, completed: false },
      { id: 5, name: '在不同浏览器上的兼容性测试', type: 'compatibility', priority: 2, completed: false },
      { id: 6, name: '应用启动和页面加载性能测试', type: 'performance', priority: 3, completed: false },
      { id: 7, name: '用户数据安全性和隐私保护测试', type: 'security', priority: 1, completed: false }
    ];
    
    setTestItems(defaultItems);
  }, []);

  // 保存数据
  useEffect(() => {
    localStorage.setItem('testingChecklists', JSON.stringify(checklists));
  }, [checklists]);

  const handleAdd = () => {
    setEditingChecklist(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingChecklist(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setChecklists(checklists.filter(item => item.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingChecklist) {
        // 编辑
        setChecklists(checklists.map(item => 
          item.id === editingChecklist.id ? { ...values, id: editingChecklist.id } : item
        ));
      } else {
        // 新增
        const newItem = { ...values, id: Date.now(), completed: false };
        setChecklists([...checklists, newItem]);
      }
      setIsModalVisible(false);
    });
  };

  const handleStatusChange = (id, completed) => {
    setChecklists(checklists.map(item => 
      item.id === id ? { ...item, completed } : item
    ));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getCompletionStats = () => {
    const total = checklists.length;
    const completed = checklists.filter(item => item.completed).length;
    return { total, completed };
  };

  const stats = getCompletionStats();

  return (
    <div className="testing-checklist">
      <Card className="testing-checklist-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              测试清单生成
              <Popover content={methodologyContent} title="方法论指导" trigger="hover">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
              </Popover>
            </Title>
            <Text type="secondary">自动生成标准化测试项，支持勾选确认完成状态</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加测试项
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="stats-card">
        <div className="stats-container">
          <div className="stat-item">
            <Text strong>总计测试项</Text>
            <Title level={4} style={{ margin: '8px 0 0' }}>{stats.total}</Title>
          </div>
          <div className="stat-item">
            <Text strong>已完成</Text>
            <Title level={4} style={{ margin: '8px 0 0', color: '#52c41a' }}>{stats.completed}</Title>
          </div>
          <div className="stat-item">
            <Text strong>完成率</Text>
            <Title level={4} style={{ margin: '8px 0 0' }}>
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </Title>
          </div>
        </div>
      </Card>

      <Card className="default-items-card">
        <Title level={5} style={{ margin: '0 0 16px 0' }}>
          <FileSearchOutlined style={{ marginRight: 8 }} />
          推荐测试项
        </Title>
        <List
          dataSource={testItems}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={
                  <Space>
                    <Tag>{item.type === 'functional' ? '功能测试' : 
                         item.type === 'ui' ? 'UI测试' : 
                         item.type === 'compatibility' ? '兼容性测试' : 
                         item.type === 'performance' ? '性能测试' : '安全测试'}</Tag>
                    <Tag color={item.priority === 1 ? 'red' : item.priority === 2 ? 'orange' : 'green'}>
                      {item.priority === 1 ? '高' : item.priority === 2 ? '中' : '低'}优先级
                    </Tag>
                  </Space>
                }
              />
              <Button 
                type="primary" 
                size="small"
                onClick={() => {
                  const newItem = { 
                    ...item, 
                    id: Date.now(),
                    name: item.name
                  };
                  delete newItem.id; // 删除原始ID
                  setChecklists([...checklists, newItem]);
                }}
              >
                添加到清单
              </Button>
            </List.Item>
          )}
        />
      </Card>

      <Divider />

      <Table
        dataSource={checklists}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="checklist-table"
      />

      <Modal
        title={editingChecklist ? "编辑测试项" : "添加测试项"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="测试项名称" 
            rules={[{ required: true, message: '请输入测试项名称' }]}
          >
            <Input placeholder="例如：用户注册功能测试" />
          </Form.Item>
          
          <Form.Item 
            name="type" 
            label="测试类型" 
            rules={[{ required: true, message: '请选择测试类型' }]}
          >
            <Select placeholder="请选择测试类型">
              <Option value="functional">功能测试</Option>
              <Option value="ui">UI测试</Option>
              <Option value="compatibility">兼容性测试</Option>
              <Option value="performance">性能测试</Option>
              <Option value="security">安全测试</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="priority" 
            label="优先级" 
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value={1}>高</Option>
              <Option value={2}>中</Option>
              <Option value={3}>低</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="测试说明"
          >
            <Input.TextArea placeholder="请输入测试说明" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

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

export default TestingChecklist;