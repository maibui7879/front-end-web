import React, { useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const TaskForm = ({ task, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        timeRange: [
          task.start_time ? dayjs(task.start_time) : null,
          task.end_time ? dayjs(task.end_time) : null,
        ],
        status: task.status || "todo",
        priority: task.priority || "medium",
      });
    } else {
      form.resetFields();
    }
  }, [task, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedTask = {
        id: task?.id,
        title: values.title,
        description: values.description,
        start_time: values.timeRange[0].format("YYYY-MM-DD HH:mm:ss"),
        end_time: values.timeRange[1].format("YYYY-MM-DD HH:mm:ss"),
        status: values.status,
        priority: values.priority,
        team_id: null,
      };

      onSave(formattedTask);
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
  <Form.Item
    label="Tiêu đề"
    name="title"
    rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    label="Thời gian"
    name="timeRange"
    rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu và kết thúc" }]}
  >
    <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
  </Form.Item>

  <Form.Item label="Mô tả" name="description">
    <TextArea rows={3} />
  </Form.Item>

  <Form.Item
    label="Trạng thái"
    name="status"
    rules={[{ required: true }]}
  >
    <Select>
      <Option value="todo">Todo</Option>
      <Option value="in_progress">In Progress</Option>
      <Option value="done">Done</Option>
    </Select>
  </Form.Item>

  <Form.Item
    label="Độ ưu tiên"
    name="priority"
    rules={[{ required: true }]}
  >
    <Select>
      <Option value="low">Low</Option>
      <Option value="medium">Medium</Option>
      <Option value="high">High</Option>
    </Select>
  </Form.Item>

  <Form.Item className="flex justify-end">
    <Button type="primary" htmlType="submit">
      Lưu công việc
    </Button>
  </Form.Item>
</Form>
  );
};

export default TaskForm;