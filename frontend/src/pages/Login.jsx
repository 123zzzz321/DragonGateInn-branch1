import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Typography, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const { Option } = Select;
const { Title, Text } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const user = await login(values.username, values.password, values.accountType);
      messageApi.success('登录成功');
      
      // 根据用户类型跳转到相应页面
      if (user.accountType === 'customer') {
        navigate('/customer/home');
      } else if (user.accountType === 'branch') {
        navigate('/branch/home');
      } else if (user.accountType === 'headquarter') {
        navigate('/headquarters/dashboard');
      }
    } catch (error) {
      messageApi.error('登录失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Card className="login-card" title={<Title level={4}>欢迎登录 Dragon Gate Inn</Title>}>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ accountType: 'customer' }}
        >
          <Form.Item
            name="accountType"
            label="账户类型"
            rules={[{ required: true, message: '请选择账户类型' }]}
          >
            <Select placeholder="选择账户类型" className="w-full">
              <Option value="customer">客户</Option>
              <Option value="branch">分店</Option>
              <Option value="headquarter">总部</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>

          <Divider className="my-4" />
          
          <div className="text-center">
            <Text>没有账户？</Text>
            <a href="/register" className="ml-2">立即注册</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;