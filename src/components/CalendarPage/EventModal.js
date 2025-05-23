import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

const EventModal = ({ visible, onCancel, onSubmit, eventData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (eventData) {
      form.setFieldsValue({
        title: eventData.title,
        description: eventData.description,
        timeRange: [dayjs(eventData.start_time), dayjs(eventData.end_time)],
      });
    } else {
      form.resetFields();
    }
  }, [eventData, form]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const payload = {
          title: values.title,
          description: values.description,
          start_time: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
          end_time: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
          is_recurring: 0,  // Mặc định 0, bỏ phần lặp lại
        };
        onSubmit(payload);
      })
      .catch(() => {
        message.error('Vui lòng điền đầy đủ thông tin hợp lệ');
      });
  };

  return (
    <Modal
      visible={visible}
      title={eventData ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện'}
      onCancel={onCancel}
      onOk={handleOk}
      okText={eventData ? 'Cập nhật' : 'Tạo'}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Nhập tiêu đề sự kiện" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Nhập mô tả (không bắt buộc)" />
        </Form.Item>

        <Form.Item
          label="Thời gian"
          name="timeRange"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
        >
          <DatePicker.RangePicker
            showTime
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventModal;
