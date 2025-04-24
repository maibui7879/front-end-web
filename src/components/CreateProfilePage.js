import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Upload,
  message,
  Typography,
  Skeleton,
  Card,
  Row,
  Col,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CreateProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = res.data;
        form.setFieldsValue({
          ...profile,
          date_of_birth: profile.date_of_birth ? dayjs(profile.date_of_birth) : null,
        });
        setAvatarUrl(profile.avatar_url || '');
      } catch {
        message.warning('Chưa có thông tin hồ sơ, vui lòng điền mới.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, [form, token]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dkshpgp3n/image/upload',
        formData
      );
      setAvatarUrl(res.data.secure_url);
      message.success('Tải ảnh lên thành công!');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      message.error('Lỗi tải ảnh lên Cloudinary!');
    }

    return false;
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    if (!avatarUrl) {
      message.warning('Vui lòng tải lên ảnh đại diện.');
      setLoading(false);
      return;
    }

    try {
      const data = {
        ...values,
        date_of_birth: values.date_of_birth?.format('YYYY-MM-DD'),
        avatar_url: avatarUrl,
      };

      await axios.put('http://localhost:5000/api/user/profile', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Cập nhật hồ sơ thành công!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      message.error('Lỗi cập nhật hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <Card
        bordered={false}
        className="max-w-5xl mx-auto rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
        bodyStyle={{ padding: 24 }}
      >
        <Title level={3} className="mb-8 border-b border-gray-500 p">
          Cập nhật hồ sơ cá nhân
        </Title>

        <Row gutter={[32, 32]} className="items-center">
          <Col xs={24} md={6} className="text-center">
            {initialLoading ? (
              <Skeleton.Avatar active size={128} shape="circle" />
            ) : (
              <div className="relative w-28 h-28 mx-auto mb-4">
                <img
                  className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
                  src={avatarUrl || 'https://i.pravatar.cc/100'}
                  alt="Avatar"
                />
                <Upload
                  accept="image/*"
                  beforeUpload={handleUpload}
                  showUploadList={false}
                >
                  <Button
                    icon={<EditOutlined />}
                    className="!p-1 !rounded-full !bg-white !shadow-md absolute bottom-1 right-1"
                  />
                </Upload>
              </div>
            )}

            <Title level={5}>
              {form.getFieldValue('full_name') || 'Tên người dùng'}
            </Title>
            <Text type="secondary">
              {form.getFieldValue('email') || 'Email'}
            </Text>
          </Col>

          <Col xs={24} md={18}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <Form.Item
                name="full_name"
                label={<Text strong>Họ và tên</Text>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label={<Text strong>Email</Text>}
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone_number"
                label={<Text strong>Số điện thoại</Text>}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="gender"
                label={<Text strong>Giới tính</Text>}
              >
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                  <Radio value="other">Khác</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="date_of_birth"
                label={<Text strong>Ngày sinh</Text>}
              >
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
              <Form.Item
                name="address"
                label={<Text strong>Địa chỉ</Text>}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="bio"
                label={<Text strong>Giới thiệu bản thân</Text>}
                className="md:col-span-2"
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <div className="md:col-span-2 text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="px-10 rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  Lưu hồ sơ
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CreateProfilePage;
