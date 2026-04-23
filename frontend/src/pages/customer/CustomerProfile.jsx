import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Col, Descriptions, Form, Input, Modal, Row, Space, Tabs, Typography } from 'antd';
import { changePassword, getCustomerProfile, updateCustomerProfile } from '../../services/customerService';

const { Title, Paragraph, Text } = Typography;

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { message, modal } = AntdApp.useApp();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getCustomerProfile();
      setProfile(data);
    } catch (error) {
      message.error(error.message || '获取个人信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditSubmit = async (values) => {
    setSaving(true);
    try {
      await updateCustomerProfile(values);
      message.success('个人信息更新成功');
      setEditModalOpen(false);
      form.resetFields();
      fetchProfile();
    } catch (error) {
      message.error(error.message || '更新失败');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('密码修改成功，请重新登录');
      setPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.message || '密码修改失败');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    modal.confirm({
      title: '确认退出',
      icon: <ExclamationCircleOutlined />,
      content: '确定要退出登录吗？',
      okText: '确认退出',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
      },
    });
  };

  const items = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          个人资料
        </span>
      ),
      children: (
        <Card className="soft-card" loading={loading}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="用户名">{profile?.username || '-'}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{profile?.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="手机号">{profile?.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="真实姓名">{profile?.realName || '-'}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{profile?.idCard ? `${profile.idCard.slice(0, 6)}****${profile.idCard.slice(-4)}` : '-'}</Descriptions.Item>
            <Descriptions.Item label="会员等级">{profile?.memberLevel || '普通会员'}</Descriptions.Item>
            <Descriptions.Item label="账户状态">
              <Text type="success">正常</Text>
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button type="primary" onClick={() => {
                form.setFieldsValue({
                  email: profile?.email,
                  phone: profile?.phone,
                  realName: profile?.realName,
                });
                setEditModalOpen(true);
              }}>
                编辑资料
              </Button>
              <Button icon={<LockOutlined />} onClick={() => setPasswordModalOpen(true)}>
                修改密码
              </Button>
            </Space>
          </div>
        </Card>
      ),
    },
    {
      key: 'account',
      label: (
        <span>
          <LockOutlined />
          账户安全
        </span>
      ),
      children: (
        <Card className="soft-card">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card size="small" hoverable onClick={() => setPasswordModalOpen(true)}>
                <Space direction="vertical">
                  <Text strong>登录密码</Text>
                  <Text type="secondary">定期修改密码可以提高账户安全性</Text>
                  <Text type="primary">修改密码</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" hoverable onClick={handleLogout}>
                <Space direction="vertical">
                  <Text strong>退出登录</Text>
                  <Text type="secondary">退出当前账户，重新登录</Text>
                  <Text type="danger">退出登录</Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>个人中心</Title>
          <Paragraph>管理您的个人信息和账户设置</Paragraph>
        </div>
      </div>

      <Tabs items={items} />

      <Modal
        title="编辑个人资料"
        open={editModalOpen}
        onCancel={() => { form.resetFields(); setEditModalOpen(false); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item label="用户名" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email', message: '请输入有效的邮箱' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="真实姓名" name="realName">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setEditModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onCancel={() => { passwordForm.resetFields(); setPasswordModalOpen(false); }}
        footer={null}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordSubmit}>
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setPasswordModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CustomerProfile;
