import React, { useState } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { LoginForm, RegisterForm } from '../../components/Forms';

const { Title } = Typography;

const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Row gutter={32} className="w-full max-w-6xl bg-white bg-opacity-50 rounded-xl p-6">
                <Col xs={24} md={12} className="text-center mb-6 md:mb-0 flex flex-col items-center justify-center">
                    <Title level={2} className="text-[#003366]">
                        TEAM MANAGER <br /> QUẢN LÍ TEAM - CÁ NHÂN TIÊN LỢI
                    </Title>
                    <Button
                        type="primary"
                        size="large"
                        className="mt-4 font-bold shadow-lg"
                        style={{
                            background: 'linear-gradient(to bottom, #5cb4ff, #2c85d5)',
                            border: 'none',
                        }}
                        onClick={toggleForm}
                    >
                        ➤ {isRegistering ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ TÀI KHOẢN'}
                    </Button>
                </Col>

                <Col xs={24} md={12}>
                    {isRegistering ? <RegisterForm onSwitch={toggleForm} /> : <LoginForm onSwitch={toggleForm} />}
                </Col>
            </Row>
        </div>
    );
};

export default AuthPage;
