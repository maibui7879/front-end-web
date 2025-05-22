import React, { useState } from 'react';
import { Input, Button, Form, message, Upload, Modal } from 'antd';
import { FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

const TeamSetting = ({ team, onClose, onSave }) => {
    const [teamInfo, setTeamInfo] = useState({
        name: team.name,
        description: team.description,
        avatar_url: team.avatar_url || '',
    });

    const [editField, setEditField] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forbiddenModal, setForbiddenModal] = useState(false);

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');

        try {
            setUploading(true);
            const res = await axios.post('https://api.cloudinary.com/v1_1/dkshpgp3n/image/upload', formData);
            const url = res.data.secure_url;

            setTeamInfo((prev) => ({ ...prev, avatar_url: url }));

            await axios.put(
                `http://localhost:5000/api/teams/${team.id}`,
                { avatar_url: url },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            message.success('Tải ảnh lên thành công');
            onSave();
        } catch (error) {
            if (error.response?.status === 403) {
                setForbiddenModal(true);
            } else {
                message.error('Lỗi khi tải ảnh');
            }
        } finally {
            setUploading(false);
        }

        return false;
    };

    const handleSaveField = async () => {
        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/teams/${team.id}`, teamInfo, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            message.success('Cập nhật thành công');
            onSave(res.data);
            setEditField(null);
        } catch (error) {
            if (error.response?.status === 403) {
                setForbiddenModal(true);
            } else {
                message.error('Không thể cập nhật');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeam = async () => {
        const token = localStorage.getItem('token');
        try {
            const confirmDelete = window.confirm('Bạn chắc chắn muốn xóa nhóm này?');
            if (confirmDelete) {
                await axios.delete(`http://localhost:5000/api/teams/${team.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success('Nhóm đã được xóa');
                onClose();
            }
        } catch (error) {
            if (error.response?.status === 403) {
                setForbiddenModal(true);
            } else {
                message.error('Không thể xóa nhóm');
            }
        }
    };

    return (
        <>
            <div className="flex justify-center bg-white p-6 rounded shadow-md">
                <div className="w-full max-w-3xl">
                    <Form layout="vertical">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="flex justify-center">
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={handleUpload}
                                    className="cursor-pointer"
                                >
                                    <div className="relative flex items-center justify-center w-fit">
                                        <div className="w-36 h-36 rounded-full border-2 border-dashed border-gray-400 overflow-hidden hover:border-blue-500 transition">
                                            {teamInfo.avatar_url ? (
                                                <img
                                                    src={teamInfo.avatar_url}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FaPlus size={24} className="text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        {teamInfo.avatar_url && (
                                            <div className="absolute -bottom-0 -right-0 bg-white px-2 py-1 rounded-full shadow hover:bg-gray-100 z-10">
                                                <EditOutlined className="text-blue-600 text-sm" />
                                            </div>
                                        )}
                                    </div>
                                </Upload>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="font-medium">Tên nhóm:</div>
                                    {editField === 'name' ? (
                                        <div className="flex-1 ml-4 flex items-center gap-2">
                                            <Input
                                                value={teamInfo.name}
                                                onChange={(e) => setTeamInfo({ ...teamInfo, name: e.target.value })}
                                            />
                                            <Button
                                                icon={<CheckOutlined />}
                                                onClick={handleSaveField}
                                                loading={loading}
                                            />
                                            <Button icon={<CloseOutlined />} onClick={() => setEditField(null)} />
                                        </div>
                                    ) : (
                                        <div className="flex-1 ml-4 flex items-center justify-between">
                                            <span>{teamInfo.name}</span>
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() => setEditField('name')}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-start">
                                    <div className="font-medium">Mô tả:</div>
                                    {editField === 'description' ? (
                                        <div className="flex-1 ml-4 flex flex-col gap-2">
                                            <Input.TextArea
                                                value={teamInfo.description}
                                                onChange={(e) =>
                                                    setTeamInfo({
                                                        ...teamInfo,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                            <div className="flex gap-2 mt-1">
                                                <Button
                                                    icon={<CheckOutlined />}
                                                    onClick={handleSaveField}
                                                    loading={loading}
                                                />
                                                <Button icon={<CloseOutlined />} onClick={() => setEditField(null)} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 ml-4 flex items-center justify-between">
                                            <span>{teamInfo.description || 'Chưa có mô tả'}</span>
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() => setEditField('description')}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button onClick={onClose}>Đóng</Button>
                            <Button
                                type="danger"
                                className="ml-4 bg-red-400 text-white hover:font-bold"
                                onClick={handleDeleteTeam}
                                loading={loading}
                            >
                                Xóa nhóm
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>

            <Modal open={forbiddenModal} onCancel={() => setForbiddenModal(false)} footer={null} centered>
                <div className="flex flex-col items-center text-center py-4">
                    <FaExclamationTriangle className="text-red-500 text-4xl mb-3" />
                    <h2 className="text-lg font-semibold mb-1">Ra ngoài chơi!</h2>
                    <p className="text-gray-600">
                        Chỉ có <span className="font-semibold">trưởng nhóm</span> mới có quyền thay đổi thông tin hoặc
                        xóa nhóm!
                    </p>
                    <div className="mt-5">
                        <Button type="primary" onClick={() => setForbiddenModal(false)}>
                            Nuh uh
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TeamSetting;
