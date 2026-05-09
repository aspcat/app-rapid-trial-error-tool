import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Space, 
  Typography,
  Card,
  Tag,
  Popover,
  List,
  Dropdown,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { 
  exportToExcel, 
  exportToCSV, 
  exportToJSON,
  topicLibraryColumns
} from '../utils/exportUtils';
import './TopicLibrary.less';

const { Title, Text } = Typography;
const { Option } = Select;

const TopicLibrary = () => {
  const [topics, setTopics] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [form] = Form.useForm();
  const [customFields, setCustomFields] = useState([]);
  const [isMethodologyVisible, setIsMethodologyVisible] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  const handleExport = (format) => {
    if (topics.length === 0) {
      message.warning('选题库暂无数据可导出');
      return;
    }

    const filename = `选题库_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'excel') {
      exportToExcel(topics, filename, topicLibraryColumns);
      message.success('Excel 导出成功');
    } else if (format === 'csv') {
      exportToCSV(topics, filename, topicLibraryColumns);
      message.success('CSV 导出成功');
    } else if (format === 'json') {
      exportToJSON(topics, filename);
      message.success('JSON 导出成功');
    }
  };

  const exportMenuItems = [
    {
      key: 'excel',
      icon: <FileExcelOutlined />,
      label: '导出为 Excel',
      onClick: () => handleExport('excel')
    },
    {
      key: 'csv',
      icon: <FileTextOutlined />,
      label: '导出为 CSV',
      onClick: () => handleExport('csv')
    },
    {
      key: 'json',
      icon: <CodeOutlined />,
      label: '导出为 JSON',
      onClick: () => handleExport('json')
    }
  ];

  // 方法论说明
  const methodologyContent = (
    <div className="methodology-content">
      <Title level={4}>选题库管理方法论</Title>
      <Text>
        <p>1. 关键词驱动：从用户痛点和市场需求出发，提取核心关键词</p>
        <p>2. 指标标注：为每个选题标注市场容量、竞争程度、技术难度等指标</p>
        <p>3. 优先级排序：结合指标和个人能力，排序开发优先级</p>
        <p>4. 两周闭环：选择优先级最高的选题，制定两周内可完成的MVP计划</p>
      </Text>
    </div>
  );

  // 默认字段
  const defaultColumns = [
    {
      title: '关键词',
      dataIndex: 'keyword',
      key: 'keyword',
      sorter: (a, b) => a.keyword.localeCompare(b.keyword),
    },
    {
      title: '市场容量',
      dataIndex: 'marketSize',
      key: 'marketSize',
      sorter: (a, b) => a.marketSize - b.marketSize,
      render: (text) => (
        <Tag color={text > 7 ? 'green' : text > 4 ? 'orange' : 'red'}>
          {text}/10
        </Tag>
      )
    },
    {
      title: '竞争程度',
      dataIndex: 'competition',
      key: 'competition',
      sorter: (a, b) => a.competition - b.competition,
      render: (text) => (
        <Tag color={text > 7 ? 'red' : text > 4 ? 'orange' : 'green'}>
          {text}/10
        </Tag>
      )
    },
    {
      title: '技术难度',
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
      render: (text) => (
        <Tag color={text > 7 ? 'green' : text > 4 ? 'orange' : 'red'}>
          {text}/10
        </Tag>
      )
    }
  ];

  // 加载数据
  useEffect(() => {
    const savedTopics = localStorage.getItem('topicLibrary');
    if (savedTopics) {
      try {
        setTopics(JSON.parse(savedTopics));
      } catch (e) {
        console.error('Failed to parse topicLibrary from localStorage', e);
        setTopics([]);
      }
    }
    
    const savedCustomFields = localStorage.getItem('customFields');
    if (savedCustomFields) {
      try {
        setCustomFields(JSON.parse(savedCustomFields));
      } catch (e) {
        console.error('Failed to parse customFields from localStorage', e);
        setCustomFields([]);
      }
    }
    setIsDataReady(true);
  }, []);

  // 保存数据
  useEffect(() => {
    if (!isDataReady) return;
    localStorage.setItem('topicLibrary', JSON.stringify(topics));
  }, [topics, isDataReady]);

  useEffect(() => {
    if (!isDataReady) return;
    localStorage.setItem('customFields', JSON.stringify(customFields));
  }, [customFields, isDataReady]);

  // 添加自定义字段到表格列
  const getColumnsWithCustomFields = () => {
    const customColumns = customFields.map(field => ({
      title: field.name,
      dataIndex: field.key,
      key: field.key,
    }));
    
    return [...defaultColumns, ...customColumns, {
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
    }];
  };

  const handleAdd = () => {
    setEditingTopic(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTopic(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingTopic) {
        // 编辑
        setTopics(topics.map(topic => 
          topic.id === editingTopic.id ? { ...values, id: editingTopic.id } : topic
        ));
      } else {
        // 新增
        const newTopic = { ...values, id: Date.now() };
        setTopics([...topics, newTopic]);
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddCustomField = () => {
    Modal.confirm({
      title: '添加自定义字段',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item 
            name="fieldName" 
            label="字段名称" 
            rules={[{ required: true, message: '请输入字段名称' }]}
          >
            <Input placeholder="例如：目标用户群体" />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        form.validateFields().then(values => {
          const newField = {
            key: `custom_${Date.now()}`,
            name: values.fieldName
          };
          setCustomFields([...customFields, newField]);
          form.resetFields();
        });
      }
    });
  };

  const handleExportTemplate = () => {
    // 实际应用中这里会生成并下载模板文件
    Modal.info({
      title: '模板导出说明',
      content: (
        <div>
          <p>模板将包含以下字段：</p>
          <List
            size="small"
            dataSource={[
              '关键词',
              '市场容量(1-10)',
              '竞争程度(1-10)',
              '技术难度(1-10)',
              '优先级(1-10)',
              ...customFields.map(f => f.name)
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </div>
      )
    });
  };

  return (
    <div className="topic-library">
      <Card className="topic-library-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              选题库管理
              <Popover content={methodologyContent} title="方法论指导" trigger="hover">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
              </Popover>
            </Title>
            <Text type="secondary">管理您的App选题，标注关键指标并排序优先级</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加选题
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={handleAddCustomField}
            >
              添加字段
            </Button>
            <Dropdown 
              menu={{ items: exportMenuItems }}
              trigger={['click']}
            >
              <Button icon={<DownloadOutlined />}>
                导出
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Card>

      <Table
        dataSource={topics}
        columns={getColumnsWithCustomFields()}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="topic-table"
      />

      <Modal
        title={editingTopic ? "编辑选题" : "添加选题"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="keyword" 
            label="关键词" 
            rules={[{ required: true, message: '请输入关键词' }]}
          >
            <Input placeholder="例如：在线教育、健康管理、社交电商" />
          </Form.Item>
          
          <Form.Item 
            name="marketSize" 
            label="市场容量 (1-10)" 
            rules={[{ required: true, message: '请选择市场容量' }]}
          >
            <Select placeholder="请选择市场容量">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <Option key={num} value={num}>{num}分</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="competition" 
            label="竞争程度 (1-10)" 
            rules={[{ required: true, message: '请选择竞争程度' }]}
          >
            <Select placeholder="请选择竞争程度">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <Option key={num} value={num}>{num}分</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="difficulty" 
            label="技术难度 (1-10)" 
            rules={[{ required: true, message: '请选择技术难度' }]}
          >
            <Select placeholder="请选择技术难度">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <Option key={num} value={num}>{num}分</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="priority" 
            label="开发优先级 (1-10)" 
            rules={[{ required: true, message: '请选择开发优先级' }]}
          >
            <Select placeholder="请选择开发优先级">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <Option key={num} value={num}>{num}分</Option>
              ))}
            </Select>
          </Form.Item>
          
          {customFields.map(field => (
            <Form.Item 
              key={field.key}
              name={field.key}
              label={field.name}
            >
              <Input placeholder={`请输入${field.name}`} />
            </Form.Item>
          ))}
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

export default TopicLibrary;
