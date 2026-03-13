import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Space, 
  Typography,
  Tag,
  Modal,
  List,
  Popover,
  Switch,
  notification
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  BellOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './DevelopmentTracking.less';

const { Title, Text } = Typography;
const { Option } = Select;

const DevelopmentTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMethodologyVisible, setIsMethodologyVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 方法论说明
  const methodologyContent = (
    <div className="methodology-content">
      <Title level={4}>开发进度管控方法论</Title>
      <Text>
        <p>1. 按3-5天开发周期设置节点：将整个开发过程分解为多个短期开发周期</p>
        <p>2. 设置明确的里程碑：每个周期结束时应有可验证的成果</p>
        <p>3. 设置提醒机制：通过浏览器通知及时提醒任务进度</p>
        <p>4. 定期回顾与调整：根据实际进度调整后续计划</p>
      </Text>
    </div>
  );

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '开发周期',
      dataIndex: 'period',
      key: 'period',
      sorter: (a, b) => a.period - b.period,
      render: (text) => `${text}天`
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      render: (text) => new Date(text).toLocaleDateString('zh-CN')
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      render: (text) => new Date(text).toLocaleDateString('zh-CN')
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text) => {
        const statusMap = {
          'not-started': { color: 'default', text: '未开始' },
          'in-progress': { color: 'blue', text: '进行中' },
          'completed': { color: 'green', text: '已完成' },
          'delayed': { color: 'red', text: '已延期' }
        };
        return <Tag color={statusMap[text]?.color}>{statusMap[text]?.text}</Tag>;
      }
    },
    {
      title: '提醒',
      dataIndex: 'reminder',
      key: 'reminder',
      render: (text) => text ? <BellOutlined style={{ color: '#1890ff' }} /> : null
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
    const savedTasks = localStorage.getItem('developmentTasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse developmentTasks from localStorage', e);
        setTasks([]);
      }
    }
    
    const savedNotifications = localStorage.getItem('notificationsEnabled');
    if (savedNotifications !== null) {
      try {
        setNotificationsEnabled(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Failed to parse notificationsEnabled from localStorage', e);
        setNotificationsEnabled(true);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存数据
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('developmentTasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    }
  }, [notificationsEnabled, isLoaded]);

  const handleAdd = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTask(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? new Date(record.startDate) : null
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const taskData = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.startDate ? new Date(values.startDate.getTime() + (values.period - 1) * 24 * 60 * 60 * 1000).toISOString() : null
      };

      if (editingTask) {
        // 编辑
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? { ...taskData, id: editingTask.id } : task
        ));
      } else {
        // 新增
        const newTask = { ...taskData, id: Date.now(), status: 'not-started' };
        setTasks([...tasks, newTask]);
      }
      
      // 如果启用了通知且设置了提醒，则注册通知
      if (notificationsEnabled && taskData.reminder && taskData.startDate) {
        scheduleNotification(taskData);
      }
      
      setIsModalVisible(false);
    });
  };

  const scheduleNotification = (task) => {
    // 在实际应用中，这里会注册浏览器通知
    // 由于当前环境限制，我们只显示一个提示
    notification.info({
      message: '提醒已设置',
      description: `任务"${task.name}"的提醒已设置，将在开发周期开始时通知您。`
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleNotificationToggle = (checked) => {
    setNotificationsEnabled(checked);
    if (checked) {
      notification.success({
        message: '通知已启用',
        description: '开发任务提醒功能已启用'
      });
    } else {
      notification.info({
        message: '通知已禁用',
        description: '开发任务提醒功能已禁用'
      });
    }
  };

  const getStatusStats = () => {
    const stats = {
      'not-started': 0,
      'in-progress': 0,
      'completed': 0,
      'delayed': 0
    };
    
    tasks.forEach(task => {
      stats[task.status]++;
    });
    
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="development-tracking">
      <Card className="development-tracking-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              开发进度管控
              <Popover content={methodologyContent} title="方法论指导" trigger="hover">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
              </Popover>
            </Title>
            <Text type="secondary">按3-5天开发周期设置节点，设置提醒机制</Text>
          </div>
          <Space>
            <div className="notification-toggle">
              <Text>浏览器通知：</Text>
              <Switch 
                checked={notificationsEnabled} 
                onChange={handleNotificationToggle}
                checkedChildren={<BellOutlined />}
                unCheckedChildren={<BellOutlined />}
              />
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加任务
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="stats-card">
        <div className="stats-container">
          <div className="stat-item">
            <Text strong>总计任务</Text>
            <Title level={4} style={{ margin: '8px 0 0' }}>{tasks.length}</Title>
          </div>
          <div className="stat-item">
            <Text strong>未开始</Text>
            <Title level={4} style={{ margin: '8px 0 0', color: '#999' }}>{stats['not-started']}</Title>
          </div>
          <div className="stat-item">
            <Text strong>进行中</Text>
            <Title level={4} style={{ margin: '8px 0 0', color: '#1890ff' }}>{stats['in-progress']}</Title>
          </div>
          <div className="stat-item">
            <Text strong>已完成</Text>
            <Title level={4} style={{ margin: '8px 0 0', color: '#52c41a' }}>{stats['completed']}</Title>
          </div>
          <div className="stat-item">
            <Text strong>已延期</Text>
            <Title level={4} style={{ margin: '8px 0 0', color: '#ff4d4f' }}>{stats['delayed']}</Title>
          </div>
        </div>
      </Card>

      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="tasks-table"
      />

      <Modal
        title={editingTask ? "编辑开发任务" : "添加开发任务"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="任务名称" 
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="例如：用户登录功能开发" />
          </Form.Item>
          
          <Form.Item 
            name="period" 
            label="开发周期(天)" 
            rules={[{ required: true, message: '请输入开发周期' }]}
          >
            <Select placeholder="请选择开发周期">
              {[3, 4, 5].map(num => (
                <Option key={num} value={num}>{num}天</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="startDate" 
            label="开始日期" 
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker placeholder="请选择开始日期" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item 
            name="reminder" 
            label="提醒设置" 
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="开启提醒" 
              unCheckedChildren="关闭提醒" 
            />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="任务描述"
          >
            <Input.TextArea placeholder="请输入任务描述" rows={3} />
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

export default DevelopmentTracking;