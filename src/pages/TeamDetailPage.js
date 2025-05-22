import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Spin, message, Divider } from 'antd';
import TeamMemberList from '../components/TeamDetailPage/TeamMemberList';
import InviteMemberModal from '../components/TeamDetailPage/InviteMemberModal';
import TeamSetting from '../components/TeamDetailPage/TeamSetting';
import TeamTaskList from '../components/TeamDetailPage/Task/TeamTaskList';

const { Title, Text } = Typography;

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [team, setTeam] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const activeTab = searchParams.get('tab') || 'members';

  useEffect(() => {
    fetchTeamDetail();
  }, [id]);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const fetchTeamDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const teamRes = await axios.get(`http://localhost:5000/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(teamRes.data);

      const creatorId = teamRes.data.creator_id;
      const creatorRes = await axios.get(`http://localhost:5000/api/user/profile/${creatorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreator(creatorRes.data.profile);

      const memberRes = await axios.get(`http://localhost:5000/api/teams/${id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(memberRes.data);
    } catch (error) {
      message.error('Không thể tải thông tin nhóm');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    const token = localStorage.getItem('token');
    try {
      const confirmDelete = window.confirm('Bạn chắc chắn muốn xóa nhóm này?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/api/teams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Nhóm đã được xóa');
        navigate('/team');
      }
    } catch (error) {
      message.error('Không thể xóa nhóm');
    }
  };

  if (loading || !team) {
    return (
      <div className="text-center py-10">
        <Spin tip="Đang tải thông tin nhóm..." />
      </div>
    );
  }

  const SidebarButton = ({ icon, label, onClick, danger, isActive }) => (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 w-full rounded transition font-medium text-sm ${
          danger
            ? 'text-red-500 hover:text-red-600'
            : isActive
            ? 'text-blue-700 font-semibold'
            : 'hover:text-blue-700'
        }`}
      >
        <i className={`fa ${icon} w-6 text-[16px] text-center mr-3`} />
        <span>{label}</span>
      </button>
    </li>
  );

  return (
    <div className="flex max-w-7xl mx-auto">
      <div className="flex-1 mr-80">
        <Title level={2}>{team.name}</Title>
        <Text type="secondary">{team.description}</Text>

        {creator && (
          <Text italic type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            Nhóm được tạo bởi{' '}
            <span className="font-bold">
              {creator.full_name || creator.username || 'người dùng'}
            </span>
          </Text>
        )}

        {activeTab === 'members' && (
          <div className="mt-6">
            <TeamMemberList members={members} onInviteClick={() => setInviteModalOpen(true)} teamId={team.id} />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="mt-6">
            <TeamTaskList teamId={team.id} />
          </div>
        )}

        {activeTab === 'setting' && (
          <div className="mt-6">
            <TeamSetting team={team} members={members} onClose={() => setActiveTab('members')} onSave={fetchTeamDetail} />
          </div>
        )}

        <InviteMemberModal
          visible={inviteModalOpen}
          onCancel={() => setInviteModalOpen(false)}
          onInvite={fetchTeamDetail}
          teamId={id}
        />
      </div>

      <div className="w-80 p-4 bg-white/60 rounded-lg shadow-lg fixed right-0 top-0 h-full overflow-auto">
        <div className="flex flex-col items-center mb-6 mt-32">
          <img
            src={team.avatar_url || '/default-avatar.png'}
            alt={team.name}
            className="rounded-full w-20 h-20 object-cover mb-4"
          />
          <Title level={4} style={{ fontSize: 16, marginBottom: 0 }}>
            {team.name}
          </Title>
          <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
            {team.description}
          </Text>
        </div>

        <Divider style={{ marginTop: 0 }} />

        <div style={{ fontSize: 12, fontWeight: '600', paddingLeft: 16, color: '#555' }}>
          Nhóm thông tin
        </div>
        <ul className="space-y-1 px-1 mt-1 mb-4">
          <SidebarButton
            icon="fa-users"
            label="Xem thành viên"
            isActive={activeTab === 'members'}
            onClick={() => setActiveTab('members')}
          />
          <SidebarButton
            icon="fa-tasks"
            label="Xem task"
            isActive={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
          />
        </ul>

        <Divider />

        <div style={{ fontSize: 12, fontWeight: '600', paddingLeft: 16, color: '#555' }}>
          Cài đặt nhóm
        </div>
        <ul className="space-y-1 px-1 mt-1 mb-4">
          <SidebarButton
            icon="fa-cog"
            label="Cài đặt"
            isActive={activeTab === 'setting'}
            onClick={() => setActiveTab('setting')}
          />
          <SidebarButton icon="fa-trash" label="Xóa nhóm" danger onClick={handleDeleteTeam} />
        </ul>
      </div>
    </div>
  );
};

export default TeamDetailPage;
