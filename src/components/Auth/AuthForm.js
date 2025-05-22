import React, { useState, useContext } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card, Row, Col, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { loginApi, registerApi } from '../../services/auth';

const { Title, Text } = Typography;

const LoginForm = ({ onSwitch }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const res = await loginApi(values.email, values.password);
            if (!res.success) {
                form.setFields([
                    { name: 'email', errors: ['Sai tài khoản hoặc mật khẩu'] },
                    { name: 'password', errors: [' '] },
                ]);
                return;
            }

            login(res.data.token);
            message.success(res.message || 'Đăng nhập thành công!');
            navigate('/home');
        } catch (error) {
            message.error('Lỗi hệ thống, vui lòng thử lại.');
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

            <Form layout="vertical" form={form} onFinish={handleLogin}>
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
            const res = await registerApi(values.email, values.password, values.full_name);

            if (!res.success) {
                if (res.message?.toLowerCase().includes('email')) {
                    form.setFields([{ name: 'email', errors: [res.message] }]);
                } else {
                    message.error(res.message || 'Lỗi đăng ký');
                }
                return;
            }

            // Đăng nhập ngay sau khi đăng ký thành công
            const loginRes = await loginApi(values.email, values.password);
            if (!loginRes.success) {
                message.error(loginRes.message || 'Lỗi đăng nhập sau khi đăng ký');
                return;
            }

            login(loginRes.data.token);
            localStorage.setItem('userId', loginRes.data.userId);

            message.success('Đăng ký và đăng nhập thành công!');
            navigate(`/create-profile?id=${loginRes.data.userId}`);
        } catch (error) {
            message.error('Lỗi hệ thống, vui lòng thử lại.');
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

            <Form layout="vertical" form={form} onFinish={handleRegister}>
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
