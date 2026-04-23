import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Empty, Form, Input, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import { createAccount, disableAccount, enableAccount, getAllAccounts, updateAccount } from '../../services/accountService';

const { Title, Paragraph } = Typography;

const accountTypeLabel = {
  customer: '客户',
  branch: '分店',
  headquarter: '总部',
};

function HeadquartersAccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form] = Form.useForm();
  const { message, modal } = AntdApp.useApp();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      setAccounts(await getAllAccounts());
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, values);
        message.success('账户已更新');
      } else {
        await createAccount(values);
        message.success('账户已创建');
      }
      setModalOpen(false);
      form.resetFields();
      fetchAccounts();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleToggleStatus = (record) => {
    const action = record.status === 'active' ? '禁用' : '启用';
    modal.confirm({
      title: `确认${action}账户`,
      icon: <ExclamationCircleOutlined />,
      content: `确定要${action}账户 "${record.username}" 吗？`,
      okText: `确认${action}`,
      okType: record.status === 'active' ? 'danger' : 'primary',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (record.status === 'active') {
            await disableAccount(record.id);
          } else {
            await enableAccount(record.id);
          }
          message.success(`账户已${action}`);
          fetchAccounts();
        } catch (error) {
          message.error(error.message);
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '账户类型',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (value) => accountTypeLabel[value] || value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'orange'}>{status === 'active' ? '正常' : '禁用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="table-actions">
          <Button
            type="link"
            onClick={() => {
              setEditingAccount(record);
              form.setFieldsValue({ ...record, password: '' });
              setModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger={record.status === 'active'}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>账户管理</Title>
          <Paragraph>这里已经与登录鉴权接口对齐，新增或禁用账户会影响登录行为。</Paragraph>
        </div>
        <Button
          type="primary"
          onClick={() => {
            setEditingAccount(null);
            form.resetFields();
            form.setFieldsValue({ accountType: 'customer', status: 'active' });
            setModalOpen(true);
          }}
        >
          新增账户
        </Button>
      </div>

      <Card className="soft-card">
        <Table rowKey="id" columns={columns} dataSource={accounts} loading={loading} />
      </Card>

      <Modal
        title={editingAccount ? '编辑账户' : '新增账户'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label={editingAccount ? '新密码（留空则不改）' : '密码'}
            name="password"
            rules={editingAccount ? [] : [{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="账户类型" name="accountType" rules={[{ required: true, message: '请选择账户类型' }]}>
            <Select options={Object.entries(accountTypeLabel).map(([value, label]) => ({ value, label }))} />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={[{ label: '正常', value: 'active' }, { label: '禁用', value: 'disabled' }]} />
          </Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}

export default HeadquartersAccountManagement;
