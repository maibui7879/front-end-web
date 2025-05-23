import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Switch, message } from 'antd';
import axios from '../../services/axios';

const SystemSettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/settings');
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Không thể tải cài đặt hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.put('/settings', values);
      message.success('Cập nhật cài đặt thành công');
    } catch (error) {
      message.error('Không thể cập nhật cài đặt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Cài đặt hệ thống" loading={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="siteName"
          label="Tên trang web"
          rules={[{ required: true, message: 'Vui lòng nhập tên trang web!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="siteDescription"
          label="Mô tả trang web"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="maintenanceMode"
          label="Chế độ bảo trì"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="maxFileSize"
          label="Kích thước file tối đa (MB)"
          rules={[{ required: true, message: 'Vui lòng nhập kích thước file tối đa!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="allowedFileTypes"
          label="Loại file được phép"
          rules={[{ required: true, message: 'Vui lòng nhập loại file được phép!' }]}
        >
          <Input placeholder="Ví dụ: .jpg,.png,.pdf" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu cài đặt
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SystemSettingsPage; 