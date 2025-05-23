import React, { useState } from 'react';
import { Select, Button, List, Avatar } from 'antd';
import useSearch from '../../hooks/useSearch';
import useUserProfileById from '../../hooks/useUserProfileById';

const { Option } = Select;

const StepThree = ({ invitedUsers = [], onConfirmFinish }) => {
  const {
    searchUsers,
    loading: searchLoading,
    selectedUser,
    handleSearch,
    handleSelect,
    setSelectedUser,
  } = useSearch();

  const { user, loading: profileLoading, avatarUrl, fullName } = useUserProfileById(selectedUser);

  const [invited, setInvited] = useState(invitedUsers);

  const handleInvite = () => {
    if (!user) return;
    if (invited.find((u) => u.id === user.id)) return;
    setInvited((prev) => [...prev, user]);
    setSelectedUser(null);
  };

  return (
    <div className="pt-4 space-y-4">
      <Select
        showSearch
        placeholder="Tìm kiếm người dùng..."
        onSearch={handleSearch}
        onChange={handleSelect}
        style={{ width: '100%' }}
        loading={searchLoading}
        filterOption={false}
        value={selectedUser}
        allowClear
      >
        {searchUsers.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.full_name} ({user.email}) - {user.phone_number}
          </Option>
        ))}
      </Select>

      {selectedUser && (
        <div className="flex items-center space-x-4 mt-2">
          {profileLoading ? (
            <span>Đang tải hồ sơ...</span>
          ) : (
            <>
              <Avatar src={avatarUrl}>{fullName?.charAt(0)}</Avatar>
              <div>
                <div className="font-semibold">{fullName}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
                <div className="text-sm text-gray-500">{user?.phone_number}</div>
              </div>
              <Button type="primary" onClick={handleInvite}>
                Mời thành viên
              </Button>
            </>
          )}
        </div>
      )}

      {invited.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Đã mời:</h4>
          <List
            itemLayout="horizontal"
            dataSource={invited}
            renderItem={(user) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={user.avatar_url}>{user.full_name?.charAt(0)}</Avatar>}
                  title={user.full_name}
                  description={`${user.email} - ${user.phone_number}`}
                />
              </List.Item>
            )}
          />
          <Button
            type="primary"
            onClick={() => onConfirmFinish(invited)}
            className="mt-4 w-full rounded-lg"
          >
            Xác nhận
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepThree;
