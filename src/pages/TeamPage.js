import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, message } from 'antd';
import CreateTeamModal from '../components/CreateTeamModal';
import TeamList from '../components/TeamList';

const { Title } = Typography;

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamId, setNewTeamId] = useState(null);

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
        }
      );
      setNewTeamId(res.data.id);
      message.success('Tạo nhóm thành công');
      fetchTeams(); // Fetch teams again to update the list
      nextStep(); // chuyển sang bước tiếp theo sau khi tạo nhóm thành công
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Nhóm của bạn</Title>
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

      <TeamList teams={teams} loading={loading} />
    </div>
  );
};

export default TeamPage;
