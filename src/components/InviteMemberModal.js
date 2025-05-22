import React, { useState } from 'react';
import { Modal, Select, Button, List, Avatar, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const InviteMemberModal = ({ visible, onCancel, onInvite, teamId }) => {
    const [searchUsers, setSearchUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);

    const handleSearchUsers = async (value) => {
        if (!value.trim()) return;
        setSearchLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/user/search?searchTerm=${value}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const users = res.data.users || [];
            setSearchUsers(users);
        } catch (error) {
            message.error('Lỗi khi tìm kiếm người dùng');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAddUser = () => {
        const alreadyInvited = invitedUsers.find((u) => u.id === selectedUserId);
        const userToAdd = searchUsers.find((u) => u.id === selectedUserId);
        if (userToAdd && !alreadyInvited) {
            setInvitedUsers([...invitedUsers, userToAdd]);
            setSelectedUserId(null);
        }
    };

    const handleConfirmInvites = async () => {
        try {
            for (const user of invitedUsers) {
                await axios.post(
                    `http://localhost:5000/api/teams/member/${teamId}/invite/${user.id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    },
                );
            }
            message.success('Đã gửi lời mời cho các thành viên');
            onInvite();
            onCancel();
            setInvitedUsers([]);
        } catch (error) {
            message.error('Không thể gửi lời mời');
        }
    };

    return (
        <Modal title="Mời thành viên" visible={visible} onCancel={onCancel} footer={null}>
            <div className="space-y-4">
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

                <Button type="dashed" block onClick={handleAddUser} disabled={!selectedUserId}>
                    Thêm vào danh sách mời
                </Button>

                {invitedUsers.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-2">Đã chọn mời:</h4>
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
                        <Button type="primary" onClick={handleConfirmInvites} className="mt-4 w-full rounded-lg">
                            Gửi lời mời
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default InviteMemberModal;
