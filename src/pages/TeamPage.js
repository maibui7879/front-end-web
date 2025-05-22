import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, message, Table, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import CreateTeamModal from '../components/CreateTeamModal';

const { Title } = Typography;

const TeamPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamDescription, setNewTeamDescription] = useState('');
    const [newTeamId, setNewTeamId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/teams', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTeams(res.data.items);
        } catch {
            message.error('Không thể tải danh sách nhóm');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (nextStep) => {
        if (!newTeamName.trim() || !newTeamDescription.trim()) {
            message.warning('Vui lòng nhập đầy đủ thông tin nhóm');
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:5000/api/teams',
                { name: newTeamName, description: newTeamDescription },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );
            setNewTeamId(res.data.id);
            message.success('Tạo nhóm thành công');
            fetchTeams();
            nextStep();
        } catch {
            message.error('Lỗi khi tạo nhóm');
        }
    };

    const handleAvatarUploaded = () => {
        setShowCreateModal(false);
        setNewTeamName('');
        setNewTeamDescription('');
        setNewTeamId(null);
        fetchTeams();
    };

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar_url',
            key: 'avatar',
            render: (url, record) => <Avatar src={url || `https://i.pravatar.cc/40?u=${record.id}`} />,
        },
        {
            title: 'Tên nhóm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Title level={3}>Danh sách nhóm</Title>
                <Button type="primary" onClick={() => setShowCreateModal(true)}>
                    Tạo nhóm
                </Button>
            </div>

            <CreateTeamModal
                visible={showCreateModal}
                onCancel={() => setShowCreateModal(false)}
                onCreate={(createdTeamId) => setNewTeamId(createdTeamId)}
                teamName={newTeamName}
                teamDescription={newTeamDescription}
                setTeamName={setNewTeamName}
                setTeamDescription={setNewTeamDescription}
                teamId={newTeamId}
                onAvatarUploaded={handleAvatarUploaded}
            />

            <Table
                dataSource={teams}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                onRow={(record) => ({
                    onClick: () => navigate(`/teams/${record.id}`),
                    style: { cursor: 'pointer' },
                })}
            />
        </div>
    );
};

export default TeamPage;
