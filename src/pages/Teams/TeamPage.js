import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import CreateTeamModal from '../../components/CreateTeamModal';
import TeamList from '../../components/TeamPage/TeamList';
import useTeamList from '../../hooks/useTeamList';

const { Title } = Typography;

const TeamPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    teams,
    loading,
    newTeamName,
    newTeamDescription,
    newTeamId,
    setNewTeamName,
    setNewTeamDescription,
    setNewTeamId,
    handleCreateTeam,
    handleAvatarUploaded,
    sortKey,
    sortOrder,
    toggleSort,
  } = useTeamList();

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
        onSubmit={handleCreateTeam}
      />

      <TeamList 
      teams={teams} 
      loading={loading} 
      sortKey={sortKey}
      sortOrder={sortOrder}
      toggleSort={toggleSort}/>
    </div>
  );
};

export default TeamPage;
