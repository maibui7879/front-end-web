import React from 'react';
import { Select, Button, List, Avatar } from 'antd';

const { Option } = Select;

const StepThree = ({
    searchUsers,
    handleSearchUsers,
    selectedUserId,
    setSelectedUserId,
    searchLoading,
    invitedUsers = [],
    onConfirmFinish,
}) => {
    return (
        <div className="pt-4 space-y-4">
            <Select
                showSearch
                placeholder="Tìm kiếm người dùng..."
                onSearch={handleSearchUsers}
                onChange={(value) => setSelectedUserId(value)}
                style={{ width: '100%' }}
                loading={searchLoading}
                filterOption={false}
                value={selectedUserId}
                allowClear
            >
                {searchUsers.map((user) => (
                    <Option key={user.id} value={user.id}>
                        {user.full_name} ({user.email}) - {user.phone_number}
                    </Option>
                ))}
            </Select>

            {invitedUsers.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2">Đã mời:</h4>
                    <List
                        itemLayout="horizontal"
                        dataSource={invitedUsers}
                        renderItem={(user) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar>{user.full_name?.charAt(0)}</Avatar>}
                                    title={user.full_name}
                                    description={`${user.email} - ${user.phone_number}`}
                                />
                            </List.Item>
                        )}
                    />
                    <Button type="primary" onClick={onConfirmFinish} className="mt-4 w-full rounded-lg">
                        Xác nhận
                    </Button>
                </div>
            )}
        </div>
    );
};

export default StepThree;
