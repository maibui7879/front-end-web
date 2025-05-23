import React from 'react';
import { Tabs, Grid } from 'antd';
import DeleteTeamButton from '../Buttons/DeleteTeamButton';
import TeamMemberList from './TeamMemberList';
import TeamTaskList from './Task/TeamTaskList';
import TeamSetting from './TeamSetting';
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const TeamTabs = ({ activeTab, setActiveTab, members, team, onInviteClick, onDelete, fetchTeamDetail }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const renderTab = (icon, label) => (
    <div className="flex items-center gap-2">
      <i className={`fa ${icon}`} />
      {!isMobile && <span>{label}</span>}
    </div>
  );

  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      style={{ marginTop: 24 }}
      centered={false}
      size="middle"
      tabBarGutter={24}
    >
      <TabPane tab={renderTab('fa-users', 'Thành viên')} key="members">
        <TeamMemberList
          members={members}
          onInviteClick={onInviteClick}
          teamId={team.id}
        />
      </TabPane>

      <TabPane tab={renderTab('fa-tasks', 'Task')} key="tasks">
        <TeamTaskList teamId={team.id} />
      </TabPane>

      <TabPane tab={renderTab('fa-cog', 'Cài đặt')} key="setting">
        <TeamSetting
          team={team}
          members={members}
          onClose={() => setActiveTab('members')}
          onSave={fetchTeamDetail}
        />
      </TabPane>
    </Tabs>
  );
};

export default TeamTabs;
