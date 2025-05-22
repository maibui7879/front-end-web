import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Skeleton,
  Descriptions,
  message,
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../contexts/AuthContext"; // 👈 Thêm dòng này

const { Title, Text } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // 👈 Lấy token từ context
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return; // 👈 Nếu chưa có token thì không gọi

      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi lấy hồ sơ:", error);
        message.error("Không thể tải hồ sơ người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]); // 👈 gọi lại nếu token thay đổi

  const handleEdit = () => {
    navigate("/create-profile");
  };

  if (loading) {
    return (
      <Card className="max-w-5xl mx-auto mt-10 p-6 rounded-2xl shadow-xl">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500">
        Không thể tải hồ sơ người dùng.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <Card
        bordered={false}
        className="max-w-5xl mx-auto rounded-2xl !shadow-lg"
        bodyStyle={{ padding: 24 }}
      >
        <Title level={3} className="text-center mb-8">
          👤 Hồ sơ cá nhân
        </Title>

        <Row gutter={[32, 32]} className="items-center">
          <Col xs={24} md={6} className="text-center">
            <Avatar
              size={100}
              src={user.avatar_url || "https://i.pravatar.cc/100"}
              icon={!user.avatar_url && <UserOutlined />}
              className="mb-4 shadow-lg"
            />
            <Title level={5}>{user.full_name}</Title>
            <Text type="secondary">{user.email}</Text>
            <div className="mt-4">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                className="rounded-full px-6 bg-blue-500 hover:bg-blue-600"
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </Col>

          <Col xs={24} md={18}>
            <Descriptions
              title={
                <span className="text-lg font-semibold text-gray-800">
                  Thông tin chi tiết
                </span>
              }
              layout="vertical"
              column={2}
              className="custom-descriptions"
            >
              <Descriptions.Item label="📞 Số điện thoại">
                {user.phone_number || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="👤 Giới tính">
                {user.gender || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="🎂 Ngày sinh">
                {user.date_of_birth
                  ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="🏡 Địa chỉ">
                {user.address || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="📝 Giới thiệu" span={2}>
                {user.bio || "Chưa có thông tin giới thiệu."}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
