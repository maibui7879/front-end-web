import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Tag, Typography, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AssignTaskModal from './AssignTaskModal';
import CreateTaskModal from './Tasks/CreateTaskModal';

const { Title } = Typography;

const getTagBgColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high':
            return '#f87171';
        case 'medium':
            return '#fde68a';
        case 'low':
            return '#86efac';
        default:
            return '#d1d5db';
    }
};

const getTagTextColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high':
            return '#7f1d1d';
        case 'medium':
            return '#92400e';
        case 'low':
            return '#166534';
        default:
            return '#374151';
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

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (time) => new Date(time).toLocaleString(),
        },
        {
            title: 'Kết thúc',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (time) => new Date(time).toLocaleString(),
        },
        {
            title: 'Phân công',
            key: 'assigned',
            render: (_, record) => {
                const entries = assignHistory[record.id] || [];
                return entries.length === 0 ? (
                    <i className="text-gray-500">Chưa phân công</i>
                ) : (
                    <Tag
                        style={{
                            backgroundColor: getTagBgColor(record.priority),
                            color: getTagTextColor(record.priority),
                            border: `1px solid ${getTagTextColor(record.priority)}`,
                            fontWeight: 600,
                        }}
                    >
                        {entries[0].full_name}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => openAssignModal(record.id)}>
                    {assignHistory[record.id]?.length ? 'Sửa phân công' : 'Phân công'}
                </Button>
            ),
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
                <div className="flex justify-center py-20">
                    <Spin size="large" />
                </div>
            ) : (
                <Table dataSource={tasks} columns={columns} rowKey="id" pagination={{ pageSize: 6 }} />
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
