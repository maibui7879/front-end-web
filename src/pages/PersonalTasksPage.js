import React, { useState } from 'react';
import {
  Card,
  Input,
  DatePicker,
  Button,
  Form,
  Row,
  Col,
  Typography,
  List,
  Space,
  Divider,
  message,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const { Title } = Typography;
const { TextArea } = Input;

const PersonalTaskPage= () => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleFinish = (values) => {
    const task = {
      ...values,
      start: values.start.format('YYYY-MM-DD HH:mm'),
      end: values.end.format('YYYY-MM-DD HH:mm'),
    };
    const updatedTasks = [...tasks];
    if (editingIndex !== null) {
      updatedTasks[editingIndex] = task;
    } else {
      updatedTasks.push(task);
    }
    setTasks(updatedTasks);
    form.resetFields();
    setEditingIndex(null);
    message.success('Lưu công việc thành công');
  };

  const handleEdit = (index) => {
    const task = tasks[index];
    form.setFieldsValue({
      ...task,
      start: dayjs(task.start),
      end: dayjs(task.end),
    });
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const chartData = {
    labels: tasks.map((task) => task.title),
    datasets: [
      {
        label: 'Thời gian ước lượng (giờ)',
        data: tasks.map((task) => parseFloat(task.estimate) || 0),
        backgroundColor: '#1890ff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ thời gian công việc',
      },
    },
  };

  return (
    <Card style={{ margin: 24, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>📁 Quản lý công việc cá nhân</Title>
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <Title level={4}>Công việc cần làm</Title>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            style={{ paddingRight: 16 }}
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="VD: Viết báo cáo, họp nhóm..." />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} placeholder="Mô tả công việc (tuỳ chọn)" />
            </Form.Item>
            <Form.Item name="estimate" label="Thời gian ước lượng (giờ)">
              <Input type="number" placeholder="Ví dụ: 4" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="start"
                  label="Bắt đầu"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="end"
                  label="Kết thúc"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                + Thêm công việc
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24} md={12}>
          <Title level={4}>📋 Danh sách công việc</Title>
          <List
            itemLayout="vertical"
            dataSource={tasks}
            bordered
            renderItem={(task, index) => (
              <List.Item
                style={{ marginBottom: 16, borderRadius: 8, background: '#fafafa' }}
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEdit(index)} style={{ color: '#1890ff' }} />,
                  <DeleteOutlined key="delete" onClick={() => handleDelete(index)} style={{ color: 'red' }} />,
                ]}
              >
                <Title level={5} style={{ textTransform: 'capitalize' }}>{task.title}</Title>
                <div style={{ marginBottom: 8 }}>
                  🕓 {task.start} → {task.end}
                </div>
                <div style={{ marginBottom: 8 }}>
                  ⏳ Ước lượng: {task.estimate} giờ
                </div>
                <div style={{ color: '#555' }}>{task.description}</div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
      {tasks.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <Divider />
          <Title level={4} style={{ textAlign: 'center' }}>📊 Tổng quan thời gian làm việc</Title>
          <Bar options={chartOptions} data={chartData} height={300} />
        </div>
      )}
    </Card>
  );
};

export default PersonalTaskPage;
