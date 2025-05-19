import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, message, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AssignTaskModal from './AssignTaskModal';
import CreateTaskModal from './CreateTaskModal';

const { Title, Text } = Typography;

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-300';
    case 'medium':
      return 'bg-yellow-300';
    case 'low':
      return 'bg-green-300';
    default:
      return 'bg-gray-300';
  }
};

const TeamTaskList = ({ teamId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [assignHistory, setAssignHistory] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
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
      const res = await axios.get(`http://localhost:5000/api/teams/task-comments/task/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

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

  const openAssignModal = (taskId) => {
    setSelectedTaskId(taskId);
    setModalVisible(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="!mb-0">Danh sách công việc</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
          Tạo Task
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {tasks.map((task) => {
            const isAssigned = (assignHistory[task.id] || []).length > 0;
            return (
              <div key={task.id} className="w-full md:w-1/3 px-2 mb-4">
                <Card
                  title={<span className="text-base font-semibold">{task.title}</span>}
                  className={`shadow rounded-xl ${getPriorityColor(task.priority)}`}
                  actions={[
                    <button
                      key="assign"
                      className="w-full py-2 font-medium hover:opacity-90"
                      onClick={() => openAssignModal(task.id)}
                    >
                      {isAssigned ? 'Sửa phân công' : 'Phân công'}
                    </button>
                  ]}
                >
                  <div className="space-y-1 text-sm">
                    <Text strong>Mô tả:</Text> <Text>{task.description}</Text><br />
                    <Text strong>Trạng thái:</Text> <Text>{task.status}</Text><br />
                    <Text strong>Ưu tiên:</Text> <Text>{task.priority}</Text><br />
                    <Text strong>Bắt đầu:</Text> <Text>{new Date(task.start_time).toLocaleString()}</Text><br />
                    <Text strong>Kết thúc:</Text> <Text>{new Date(task.end_time).toLocaleString()}</Text>
                  </div>

                  <div className="mt-3 text-sm">
                    <Text strong>Phân công:</Text>
                    {(assignHistory[task.id] || []).length === 0 ? (
                      <div className="mt-1 italic text-gray-600">chưa có phân công </div>
                    ) : (
                      <ul className="list-disc list-inside mt-1">
                        {assignHistory[task.id].map((entry, idx) => (
                          <li key={idx}>{entry.full_name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <AssignTaskModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        taskId={selectedTaskId}
        teamId={teamId}
        onAssignSuccess={() => {
          fetchTasks();
          fetchAssignComments(selectedTaskId);
        }}
      />

      <CreateTaskModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onCreate={() => {
          setCreateModalVisible(false);
          fetchTasks();
        }}
        teamId={teamId}
      />
    </div>
  );
};

export default TeamTaskList;
