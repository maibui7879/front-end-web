import React, { useState } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { LoginForm, RegisterForm } from './Forms';

const { Title } = Typography;

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Quản lý trạng thái hiển thị form đăng ký hay đăng nhập

  const toggleForm = () => {
    setIsRegistering(!isRegistering); // Đổi trạng thái giữa form đăng nhập và đăng ký
  };

  return (
    <div className="min-h-screen bg-[#f4fafd] flex items-center justify-center px-4 py-10">
      <Row gutter={32} className="w-full max-w-6xl">
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
            onClick={toggleForm} // Tạo sự kiện chuyển đổi giữa đăng nhập và đăng ký
          >
            ➤ {isRegistering ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ TÀI KHOẢN'}
          </Button>
        </Col>

        <Col xs={24} md={12}>
          {isRegistering ? (
            <RegisterForm onSwitch={toggleForm} /> // Chuyển sang form đăng nhập khi bấm vào 'Đăng nhập'
          ) : (
            <LoginForm onSwitch={toggleForm} /> // Chuyển sang form đăng ký khi bấm vào 'Đăng ký'
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AuthPage;
