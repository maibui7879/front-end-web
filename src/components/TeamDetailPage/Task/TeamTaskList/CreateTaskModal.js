import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const CreateTaskModal = ({ visible, onCancel, onCreate, teamId }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        {
          title: values.title,
          team_id: teamId,
          start_time: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
          end_time: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
          description: values.description,
          status: values.status,
          priority: values.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 201) {
        message.success('Tạo task thành công');
        form.resetFields();
        onCreate();
      } else {
        message.error('Lỗi khi tạo task');
      }
    } catch (error) {
      if (error.errorFields) return; // validation error, không hiện message
      message.error('Lỗi khi tạo task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo Task mới"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Tạo"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'todo', priority: 'medium' }}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Thời gian"
          name="timeRange"
          rules={[{ type: 'array', required: true, message: 'Vui lòng chọn thời gian' }]}
        >
          <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
          <Select>
            <Option value="todo">Todo</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="done">Done</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Độ ưu tiên" name="priority" rules={[{ required: true }]}>
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
