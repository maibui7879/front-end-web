import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, message, Modal } from 'antd';
import TeamInfo from '../../components/TeamDetailPage/TeamInfo';
import TeamTabs from '../../components/TeamDetailPage/TeamTabs';
import InviteMemberModal from '../../components/TeamDetailPage/InviteMemberModal';
import useTeamDetail from '../../hooks/useTeamDetail';
import axios from 'axios';
const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const { team, creator, members, loading, fetchTeamDetail } = useTeamDetail(id);

  const activeTab = searchParams.get('tab') || 'members';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleDeleteTeam = () => {
    Modal.confirm({
      title: 'Bạn chắc chắn muốn xóa nhóm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/api/teams/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success('Nhóm đã được xóa');
          navigate('/team');
        } catch (error) {
          message.error('Không thể xóa nhóm');
        }
      },
    });
  };

  if (loading || !team) {
    return (
      <div className="text-center py-10">
        <Spin tip="Đang tải thông tin nhóm..." />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
      <TeamInfo team={team} creator={creator} />
      <TeamTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        members={members}
        team={team}
        onInviteClick={() => setInviteModalOpen(true)}
        onDelete={handleDeleteTeam}
        fetchTeamDetail={fetchTeamDetail}
      />
      <InviteMemberModal
        visible={inviteModalOpen}
        onCancel={() => setInviteModalOpen(false)}
        onInvite={fetchTeamDetail}
        teamId={id}
      />
    </div>
  );
};

export default TeamDetailPage;
