import React, { useMemo, useState } from 'react';
import { Button, Card, Form, Input, Progress, Select, Space, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const { Title, Text } = Typography;

const getPasswordStrength = (value) => {
  if (!value) {
    return 0;
  }

  let score = 0;
  if (value.length >= 8) score += 35;
  if (/[A-Z]/.test(value)) score += 20;
  if (/[a-z]/.test(value)) score += 20;
  if (/[0-9]/.test(value)) score += 25;
  return score;
};

function Register() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values.username, values.password, values.accountType);
      message.success('注册成功，请返回登录');
      navigate('/login');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: 24 }}>
          <Text className="eyebrow">Dragon Gate Inn</Text>
          <Title level={3} style={{ margin: 0 }}>
            创建账号
          </Title>
          <Text type="secondary">注册会写入共享 mock 数据，之后可以直接用新账号登录。</Text>
        </Space>

        <Form layout="vertical" initialValues={{ accountType: 'customer' }} onFinish={onFinish}>
          <Form.Item
            label="账户类型"
            name="accountType"
            rules={[{ required: true, message: '请选择账户类型' }]}
          >
            <Select
              options={[
                { label: '客户', value: 'customer' },
                { label: '分店', value: 'branch' },
                { label: '总部', value: 'headquarter' },
              ]}
            />
          </Form.Item>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少 8 位' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (!/[A-Z]/.test(value)) return Promise.reject(new Error('至少包含一个大写字母'));
                  if (!/[a-z]/.test(value)) return Promise.reject(new Error('至少包含一个小写字母'));
                  if (!/[0-9]/.test(value)) return Promise.reject(new Error('至少包含一个数字'));
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password size="large" onChange={(event) => setPassword(event.target.value)} />
          </Form.Item>

          {password ? (
            <div style={{ marginBottom: 20 }}>
              <Text type="secondary">密码强度</Text>
              <Progress
                percent={passwordStrength}
                size="small"
                status={passwordStrength < 60 ? 'exception' : passwordStrength < 85 ? 'active' : 'success'}
              />
            </div>
          ) : null}

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            注册
          </Button>
        </Form>

        <div className="auth-footer">
          <Text type="secondary">已经有账号了？</Text>
          <Link to="/login">返回登录</Link>
        </div>
      </Card>
    </div>
  );
}

export default Register;
