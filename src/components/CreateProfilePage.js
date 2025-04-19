import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Radio, Button, Upload, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const CreateProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(''); // Đảm bảo sử dụng avatarUrl thay vì avatarBase64

  const token = localStorage.getItem('token');

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
        setAvatarUrl(profile.avatar || ''); // Set lại avatarUrl cho ảnh
      } catch (err) {
        message.warning('Chưa có thông tin hồ sơ, vui lòng điền mới.');
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
      setAvatarUrl(res.data.secure_url); // Cập nhật avatarUrl từ Cloudinary
      message.success('Tải ảnh lên thành công!');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      message.error('Lỗi tải ảnh lên Cloudinary!');
    }
  
    return false; // Chặn upload mặc định của antd
  };
  

  const handleSubmit = async (values) => {
    setLoading(true);
  
    console.log('Avatar URL trước khi submit: ', avatarUrl);
  
    if (!avatarUrl) {
      message.warning('Vui lòng tải lên ảnh đại diện.');
      setLoading(false);
      return;
    }
  
    try {
      const data = {
        ...values,
        date_of_birth: values.date_of_birth?.format('YYYY-MM-DD'),
        avatar_url: avatarUrl, // Sử dụng avatar_url thay vì avatar
      };
  
      // Gửi dữ liệu lên API để cập nhật hồ sơ
      const res = await axios.put('http://localhost:5000/api/user/profile', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Dữ liệu trả về sau khi cập nhật: ', res.data); // Kiểm tra kết quả trả về
      message.success('Cập nhật hồ sơ thành công!');
      window.location.href = '/';
    } catch (err) {
      message.error('Lỗi cập nhật hồ sơ!');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6 text-center">Tạo / Cập nhật hồ sơ</h2>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
              <Radio value="other">Khác</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="date_of_birth" label="Ngày sinh">
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Giới thiệu bản thân">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            <Upload
              accept="image/*"
              beforeUpload={handleUpload}
              showUploadList={false}
            >
              <Button>Chọn ảnh</Button>
            </Upload>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="avatar"
                className="mt-2 w-32 h-32 object-cover rounded-full"
              />
            )}
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Lưu hồ sơ
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreateProfilePage;
