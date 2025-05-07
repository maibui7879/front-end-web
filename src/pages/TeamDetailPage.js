import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Spin, message, Button, Divider, Row, Col, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons'; // Import Menu icon for toggle button
import TeamCreator from '../components/TeamCreator';
import TeamMemberCard from '../components/TeamMemberCard';
import InviteMemberModal from '../components/InviteMemberModal';

const { Title, Text } = Typography;

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // State to toggle sidebar visibility

  useEffect(() => {
    fetchTeamDetail();
  }, [id]);

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
      const memberList = memberRes.data;
      setMembers(memberList);
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
        navigate('/team'); // Navigate to the team list page or any other desired page
      }
    } catch (error) {
      message.error('Không thể xóa nhóm');
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };

  if (loading || !team) {
    return (
      <div className="text-center py-10">
        <Spin tip="Đang tải thông tin nhóm..." />
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="flex-1 mr-80">
        <Title level={2}>{team.name}</Title>
        <Text type="secondary">{team.description}</Text>

        <div className="mt-4">
          <TeamCreator creator={creator} />
        </div>

        <div className="flex justify-between items-center mt-8 mb-4">
          <Title level={4}>Thành viên nhóm</Title>
          <Button type="primary" onClick={() => setInviteModalOpen(true)}>
            Mời thành viên
          </Button>
        </div>

        {/* Member cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

        <InviteMemberModal
          visible={inviteModalOpen}
          onCancel={() => setInviteModalOpen(false)}
          onInvite={fetchTeamDetail}
          teamId={id}
        />

        <div className="mt-6">
          <Button type="danger" onClick={handleDeleteTeam}>
            Xóa nhóm
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`w-80 p-4 bg-white rounded-lg shadow-lg fixed right-0 top-0 h-full ${sidebarVisible ? '' : 'hidden'}`}>
        <div className="flex flex-col items-center mb-6">
          <img
            src={team.avatar_url || '/default-avatar.png'}
            alt={team.name}
            className="rounded-full w-20 h-20 object-cover mb-4"
          />
          <Title level={4}>{team.name}</Title>
          <Text type="secondary">{team.description}</Text>
        </div>

        <Divider />
        <Button block onClick={() => navigate(`/teams/${id}`)} className="mb-2">
          Xem thành viên
        </Button>
        <Button block onClick={() => navigate(`/teams/${id}/tasks`)} className="mb-2">
          Xem task
        </Button>
        <Button block onClick={() => navigate(`/teams/${id}/settings`)} className="mb-2">
          Cài đặt
        </Button>
      </div>

      {/* Hamburger menu button */}
      <Button 
        icon={<MenuOutlined />} 
        type="primary" 
        className="absolute top-4 left-4 z-50" 
        onClick={toggleSidebar} 
      />
    </div>
  );
};

export default TeamDetailPage;
