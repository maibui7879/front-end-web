import React from 'react';
import { Table, Avatar, Typography, Dropdown, Menu, Modal, Select, message, Button } from 'antd';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useTeamMembers from '../../hooks/useTeamMember';

const { Text } = Typography;
const { Option } = Select;

const AvatarInitials = ({ initials }) => (
  <Avatar style={{ backgroundColor: '#87d068' }}>{initials}</Avatar>
);

const TeamMemberList = ({ onInviteClick, teamId }) => {
  const navigate = useNavigate();
  const {
    members,
    selectedMember,
    newRole,
    roleModalVisible,
    forbiddenModal,
    dropdownVisible,
    dropdownAnchor,
    canManage,
    setSelectedMember,
    setNewRole,
    setRoleModalVisible,
    setForbiddenModal,
    setDropdownVisible,
    setDropdownAnchor,
    confirmRemoveMember,
    handleChangeRole,
  } = useTeamMembers(teamId);

  const menu = (member) => (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate(`/profile/${member.id}`)}>
        Xem hồ sơ
      </Menu.Item>
      {canManage && (
        <>
          <Menu.Item key="2" onClick={() => {
            setSelectedMember(member);
            setNewRole(member.role);
            setRoleModalVisible(true);
            setDropdownVisible(false);
          }}>
            Thay đổi vai trò
          </Menu.Item>
          <Menu.Item key="3" danger onClick={() => {
            setDropdownVisible(false);
            confirmRemoveMember(member);
          }}>
            Xóa thành viên khỏi nhóm
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const columns = [
    {
      title: 'Thành viên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, member) => (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          onClick={() => navigate(`/profile/${member.id}`)}
        >
          {member.avatarUrl ? (
            <Avatar src={member.avatarUrl} />
          ) : (
            <AvatarInitials initials={member.initials} />
          )}
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Text>{role}</Text>,
      width: 120,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mt-8 mb-4">
        <Typography.Title level={4}>Thành viên nhóm</Typography.Title>
        <Button type="primary" onClick={onInviteClick}>Mời thành viên</Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={members} pagination={false} />

      {selectedMember && dropdownAnchor && (
        <Dropdown
          overlay={menu(selectedMember)}
          visible={dropdownVisible}
          onVisibleChange={(flag) => setDropdownVisible(flag)}
          getPopupContainer={() => dropdownAnchor}
          placement="bottomLeft"
        >
          <div />
        </Dropdown>
      )}

      <Modal
        title="Thay đổi vai trò"
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        onOk={handleChangeRole}
      >
        <Select className="w-full" value={newRole} onChange={setNewRole}>
          <Option value="member">Thành viên</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </Modal>

      <Modal
        open={forbiddenModal}
        onCancel={() => setForbiddenModal(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col items-center text-center py-4">
          <FaExclamationTriangle className="text-red-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold mb-1">Ra ngoài chơi!</h2>
          <p className="text-gray-600">
            Chỉ có <span className="font-semibold">trưởng nhóm</span> mới có quyền thay đổi thông tin hoặc xóa nhóm!
          </p>
          <div className="mt-5">
            <Button type="primary" onClick={() => setForbiddenModal(false)}>Nuh uh</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamMemberList;
