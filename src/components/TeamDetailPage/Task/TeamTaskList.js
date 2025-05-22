import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  Typography,
  message,
  Spin,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CreateTaskModal from '../CreateTaskModal';
import AssignTaskModal from './AssignTaskModal';

const { Title } = Typography;
const { Option } = Select;

const TeamTaskList = ({ teamId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const [assignHistory, setAssignHistory] = useState({});
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/team/${teamId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(res.data.personalTasks || []);
    } catch {
      message.error('Không thể tải danh sách task');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignComments = async (taskId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/teams/task-comments/task/${taskId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const assignComments = res.data.comments
        .filter((c) => c.comment?.match(/\*\* Người dùng (.+?) đã được phân công/))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (assignComments.length === 0) {
        setAssignHistory((prev) => ({ ...prev, [taskId]: [] }));
        return;
      }

      const lastAssign = assignComments[0];
      const match = lastAssign.comment.match(/\*\* Người dùng (.+?) đã được phân công/);
      if (!match) return;

      const userId = match[1];
      if (userId === 'null') {
        setAssignHistory((prev) => ({ ...prev, [taskId]: [] }));
        return;
      }

      const userRes = await axios.get(`http://localhost:5000/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const entry = {
        full_name: userRes.data.profile.full_name,
        created_at: new Date(lastAssign.created_at).toLocaleString(),
      };

      setAssignHistory((prev) => ({ ...prev, [taskId]: [entry] }));
    } catch {
      message.error('Không thể tải phân công mới nhất');
    }
  };

  useEffect(() => {
    if (teamId) fetchTasks();
  }, [teamId]);

  useEffect(() => {
    tasks.forEach((task) => {
      if (!assignHistory[task.id]) fetchAssignComments(task.id);
    });
  }, [tasks]);

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      timeRange: [dayjs(record.start_time), dayjs(record.end_time)],
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id) => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          start_time: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
          end_time: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success('Đã cập nhật task');
      setEditingKey('');
      fetchTasks();
    } catch (err) {
      if (err.errorFields) return;
      message.error('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (taskId) => {
    setSelectedTaskId(taskId);
    setAssignModalVisible(true);
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      editable: true,
      render: (_, record) => {
        if (editingKey === record.id) {
          return (
            <Form.Item
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              style={{ margin: 0 }}
            >
              <Input />
            </Form.Item>
          );
        }
        return <div onClick={() => edit(record)}>{record.title}</div>;
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      editable: true,
      render: (_, record) => {
        if (editingKey === record.id) {
          return (
            <Form.Item name="description" style={{ margin: 0 }}>
              <Input.TextArea autoSize />
            </Form.Item>
          );
        }
        return <div onClick={() => edit(record)}>{record.description}</div>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      editable: true,
      render: (_, record) => {
        if (editingKey === record.id) {
          return (
            <Form.Item name="status" rules={[{ required: true }]} style={{ margin: 0 }}>
              <Select>
                <Select.Option value="todo">Todo</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="done">Done</Select.Option>
              </Select>
            </Form.Item>
          );
        }
        return <div onClick={() => edit(record)}>{record.status}</div>;
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      editable: true,
      render: (_, record) => {
        if (editingKey === record.id) {
          return (
            <Form.Item name="priority" rules={[{ required: true }]} style={{ margin: 0 }}>
              <Select>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </Form.Item>
          );
        }
        return <div onClick={() => edit(record)}>{record.priority}</div>;
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      render: (_, record) => {
        if (editingKey === record.id) {
          return (
            <Form.Item
              name="timeRange"
              rules={[{ type: 'array', required: true, message: 'Vui lòng chọn thời gian' }]}
              style={{ margin: 0 }}
            >
              <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
            </Form.Item>
          );
        }
        return (
          <div onClick={() => edit(record)}>
            {dayjs(record.start_time).format('YYYY-MM-DD HH:mm')} → {dayjs(record.end_time).format('YYYY-MM-DD HH:mm')}
          </div>
        );
      },
    },
    {
      title: 'Phân công',
      key: 'assigned',
      render: (_, record) => {
        const entries = assignHistory[record.id] || [];
        return entries.length === 0 ? (
          <i className="text-gray-500">Chưa phân công</i>
        ) : (
          <div
            style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
            onClick={() => openAssignModal(record.id)}
          >
            {entries[0].full_name}
          </div>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (_, record) => {
        if (editingKey === record.id) {
          return (
            <>
              <Button type="link" onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                Lưu
              </Button>
              <Button type="link" onClick={cancel}>
                Huỷ
              </Button>
            </>
          );
        }
        return
      },
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="!mb-0">
          Danh sách công việc
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
          Tạo Task
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải..." />
      ) : (
        <Form form={form} component={false}>
          <Table
            rowKey="id"
            dataSource={tasks}
            columns={columns}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Form>
      )}

      <CreateTaskModal
        teamId={teamId}
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          fetchTasks();
        }}
      />

      <AssignTaskModal
        teamId={teamId}
        taskId={selectedTaskId}
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onSuccess={() => {
          setAssignModalVisible(false);
          fetchAssignComments(selectedTaskId);
          fetchTasks();
        }}
      />
    </div>
  );
};

export default TeamTaskList;
