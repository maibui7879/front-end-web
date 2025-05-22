// CreateTeamModal.js
import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepProgress from './StepProgress';
import axios from 'axios';

const CreateTeamModal = ({
    visible,
    onCancel,
    onCreate,
    teamName,
    teamDescription,
    setTeamName,
    setTeamDescription,
    teamId,
    onAvatarUploaded,
}) => {
    const [step, setStep] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [searchUsers, setSearchUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);

    const handleCreateTeam = async (nextStep) => {
        if (!teamName.trim() || !teamDescription.trim()) {
            message.warning('Vui lòng nhập đầy đủ thông tin nhóm');
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:5000/api/teams',
                { name: teamName, description: teamDescription },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            const createdTeamId = res.data.teamId;
            message.success('Tạo nhóm thành công');
            nextStep(createdTeamId);
        } catch (error) {
            message.error('Lỗi khi tạo nhóm');
        }
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');

        try {
            setUploading(true);
            const res = await axios.post('https://api.cloudinary.com/v1_1/dkshpgp3n/image/upload', formData);

            const url = res.data.secure_url;
            setAvatarUrl(url);

            await axios.put(
                `http://localhost:5000/api/teams/${teamId}`,
                { avatar_url: url },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            message.success('Tải ảnh lên thành công');
        } catch (error) {
            message.error('Lỗi khi tải ảnh');
        } finally {
            setUploading(false);
        }

        return false;
    };

    const handleNext = (createdTeamId) => {
        setStep(2);
        onCreate(createdTeamId);
    };

    const handleFinishUpload = () => {
        setStep(3);
    };

    const handleCancel = async () => {
        if (teamId) {
            try {
                await axios.delete(`http://localhost:5000/api/teams/${teamId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                message.info('Đã hủy và xóa nhóm');
            } catch (error) {
                message.error('Lỗi khi xóa nhóm');
            }
        }

        setStep(1);
        setAvatarUrl(null);
        setSelectedUserId(null);
        setSearchUsers([]);
        setInvitedUsers([]);
        onCancel();
    };

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

    const handleInvite = async () => {
        if (!selectedUserId) {
            message.warning('Vui lòng chọn người dùng');
            return;
        }
        try {
            await axios.post(
                `http://localhost:5000/api/teams/member/${teamId}/invite/${selectedUserId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );

            const invitedUser = searchUsers.find((user) => user.id === selectedUserId);
            if (invitedUser) {
                setInvitedUsers((prev) => [...prev, invitedUser]);
            }

            message.success('Đã gửi lời mời');
            setSelectedUserId(null);
        } catch (error) {
            message.error('Không thể gửi lời mời');
        }
    };

    const handleDone = () => {
        setStep(1);
        setSelectedUserId(null);
        setSearchUsers([]);
        setInvitedUsers([]);
        onAvatarUploaded();
    };

    return (
        <Modal
            title={step === 1 ? 'Tạo nhóm mới' : step === 2 ? 'Thêm ảnh nhóm' : 'Mời thành viên (tuỳ chọn)'}
            open={visible}
            onCancel={handleCancel}
            footer={
                <div className="flex justify-between items-center">
                    <Button onClick={handleCancel} className="rounded-lg">
                        Hủy
                    </Button>

                    <div className="flex gap-2">
                        {step === 1 && (
                            <Button
                                type="primary"
                                onClick={() => handleCreateTeam(handleNext)}
                                disabled={!teamName.trim() || !teamDescription.trim()}
                                className="rounded-lg"
                            >
                                Tiếp theo
                            </Button>
                        )}
                        {step === 2 && (
                            <>
                                <Button onClick={handleFinishUpload} className="rounded-lg" disabled={uploading}>
                                    Bỏ qua
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleFinishUpload}
                                    disabled={uploading}
                                    className="rounded-lg"
                                >
                                    Tiếp theo
                                </Button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <Button onClick={handleDone} className="rounded-lg">
                                    Bỏ qua
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleInvite}
                                    disabled={!selectedUserId}
                                    className="rounded-lg"
                                >
                                    Mời
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            {step === 1 && (
                <StepOne
                    teamName={teamName}
                    teamDescription={teamDescription}
                    setTeamName={setTeamName}
                    setTeamDescription={setTeamDescription}
                />
            )}
            {step === 2 && (
                <StepTwo
                    avatarUrl={avatarUrl}
                    setAvatarUrl={setAvatarUrl}
                    handleUpload={handleUpload}
                    uploading={uploading}
                />
            )}
            {step === 3 && (
                <StepThree
                    searchUsers={searchUsers}
                    handleSearchUsers={handleSearchUsers}
                    selectedUserId={selectedUserId}
                    setSelectedUserId={setSelectedUserId}
                    searchLoading={searchLoading}
                    invitedUsers={invitedUsers}
                    onConfirmFinish={handleDone}
                />
            )}
            <StepProgress step={step} />
        </Modal>
    );
};

export default CreateTeamModal;
