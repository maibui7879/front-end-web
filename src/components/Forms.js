import React, { useState, useContext } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card, Row, Col, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Đường dẫn đúng với dự án của bạn

const { Title, Text } = Typography;

const LoginForm = ({ onSwitch }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', values);
            login(res.data.token); // Cập nhật AuthContext và localStorage
            message.success(res.data.message || 'Đăng nhập thành công!');
            navigate('/home');
        } catch (err) {
            form.setFields([
                {
                    name: 'email',
                    errors: ['Sai tài khoản hoặc mật khẩu'],
                },
                {
                    name: 'password',
                    errors: [' '],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl shadow-xl max-w-md mx-auto">
            <Title level={3} className="text-center mb-8">
                <span className="text-[#007bff]">QUẢN LÍ</span>
                <span className="text-[#003366]"> CÁ NHÂN</span>
                <br />
                <Text className="text-base">Đăng nhập tài khoản</Text>
            </Title>

            <Form layout="vertical" onFinish={handleLogin} form={form}>
                <Form.Item
                    label="Địa chỉ email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Row justify="space-between">
                        <Col>
                            <Checkbox defaultChecked>Lưu đăng nhập</Checkbox>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        ĐĂNG NHẬP
                    </Button>
                </Form.Item>

                <p className="text-center">
                    Chưa có tài khoản?{' '}
                    <button className="text-blue-500 hover:text-blue-700" onClick={onSwitch}>
                        Đăng ký
                    </button>
                </p>
            </Form>
        </Card>
    );
};

const RegisterForm = ({ onSwitch }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                email: values.email,
                password: values.password,
                full_name: values.full_name,
            });

            const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
                email: values.email,
                password: values.password,
            });

            const token = loginRes.data.token;
            const userId = loginRes.data.userId;

            login(token); // Cập nhật AuthContext và localStorage
            localStorage.setItem('userId', userId); // Optional: lưu userId riêng

            message.success('Đăng ký & đăng nhập thành công!');
            navigate(`/create-profile?id=${userId}`);
        } catch (err) {
            if (err.response?.status === 409) {
                form.setFields([
                    {
                        name: 'email',
                        errors: ['Email đã được sử dụng'],
                    },
                ]);
            } else {
                message.error(err.response?.data?.message || 'Lỗi đăng ký');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl shadow-xl max-w-md mx-auto">
            <Title level={3} className="text-center mb-8">
                <span className="text-[#007bff]">QUẢN LÍ</span>
                <span className="text-[#003366]"> CÁ NHÂN</span>
                <br />
                <Text className="text-base">Đăng ký tài khoản</Text>
            </Title>

            <Form layout="vertical" onFinish={handleRegister} form={form}>
                <Form.Item
                    label="Họ và tên"
                    name="full_name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        ĐĂNG KÝ
                    </Button>
                </Form.Item>

                <p className="mx-auto text-center">
                    Đã có tài khoản?{' '}
                    <button className="text-blue-500 hover:text-blue-700" onClick={onSwitch}>
                        Đăng nhập
                    </button>
                </p>
            </Form>
        </Card>
    );
};

export { LoginForm, RegisterForm };
