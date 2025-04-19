import React, { useState } from 'react';
import { Tabs, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', values);

      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { token } = loginResponse.data;
      localStorage.setItem('token', token);
      message.success('Đăng ký & đăng nhập thành công!');
      navigate('/create-profile');
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi đăng ký hoặc đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', values);
      const { token, message: successMessage } = response.data;
      localStorage.setItem('token', token);
      message.success(successMessage || 'Đăng nhập thành công!');
      navigate('/'); // Trang chính sau khi đăng nhập
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 w-full">
      <div className="bg-white p-8 rounded-xl shadow-md w-full md:w-1/3">
        <Tabs defaultActiveKey="login" centered>
          <Tabs.TabPane tab="Đăng nhập" key="login">
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Đăng nhập
              </Button>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đăng ký" key="register">
            <Form layout="vertical" onFinish={handleRegister}>
              <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Đăng ký
              </Button>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
