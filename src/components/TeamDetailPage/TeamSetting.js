import React, { useState } from 'react';
import { Upload, message, Modal, Button, Input, Form } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const TeamSetting = ({ team, onClose, onSave }) => {
  const [teamInfo, setTeamInfo] = useState({
    name: team.name,
    description: team.description,
    avatar_url: team.avatar_url || '',
  });
  const [editField, setEditField] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [forbiddenModalVisible, setForbiddenModalVisible] = useState(false);

  const token = localStorage.getItem('token');

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    setUploading(true);
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dkshpgp3n/image/upload',
        formData
      );
      const url = res.data.secure_url;
      setTeamInfo((prev) => ({ ...prev, avatar_url: url }));

      await axios.put(
        `http://localhost:5000/api/teams/${team.id}`,
        { avatar_url: url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success('Tải ảnh lên thành công');
      onSave();
    } catch (error) {
      if (error.response?.status === 403) {
        setForbiddenModalVisible(true);
      } else {
        message.error('Lỗi khi tải ảnh');
      }
    } finally {
      setUploading(false);
    }

    return false;
  };

  const handleSaveField = async () => {
    if (!teamInfo.name.trim()) {
      message.warning('Tên nhóm không được để trống');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/teams/${team.id}`,
        teamInfo,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success('Cập nhật thành công');
      onSave(res.data);
      setEditField(null);
    } catch (error) {
      if (error.response?.status === 403) {
        setForbiddenModalVisible(true);
      } else {
        message.error('Không thể cập nhật thông tin nhóm');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async () => {
    const confirmDelete = window.confirm('Bạn chắc chắn muốn xóa nhóm này?');
    if (!confirmDelete) return;

    setSaving(true);
    try {
      await axios.delete(`http://localhost:5000/api/teams/${team.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Nhóm đã được xóa');
      onClose();
    } catch (error) {
      if (error.response?.status === 403) {
        setForbiddenModalVisible(true);
      } else {
        message.error('Không thể xóa nhóm');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto">
        <Form layout="vertical">
          <div className="grid grid-cols-1 w-1/2 gap-6 items-center">
            <div className="relative w-36 h-36">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleUpload}
                disabled={uploading || saving}
                className="cursor-pointer w-full h-full rounded-full overflow-hidden border-2 border-dashed border-gray-400 hover:border-blue-500 flex items-center justify-center"
              >
                {teamInfo.avatar_url ? (
                  <img
                    src={teamInfo.avatar_url}
                    alt="avatar"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <FaPlus size={24} className="text-gray-400" />
                )}
              </Upload>

              {teamInfo.avatar_url && (
                <div
                  onClick={() => document.querySelector('input[type=file]').click()}
                  className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 cursor-pointer"
                  style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}
                >
                  <EditOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="font-semibold mb-1 block">Tên nhóm:</label>
                {editField === 'name' ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      value={teamInfo.name}
                      onChange={(e) =>
                        setTeamInfo((prev) => ({ ...prev, name: e.target.value }))
                      }
                      disabled={saving}
                    />
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={handleSaveField}
                      loading={saving}
                    />
                    <Button
                      icon={<CloseOutlined />}
                      onClick={() => setEditField(null)}
                      disabled={saving}
                    />
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{teamInfo.name}</span>
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => setEditField('name')}
                      disabled={saving}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold mb-1 block">Mô tả:</label>
                {editField === 'description' ? (
                  <>
                    <Input.TextArea
                      value={teamInfo.description}
                      onChange={(e) =>
                        setTeamInfo((prev) => ({ ...prev, description: e.target.value }))
                      }
                      rows={4}
                      disabled={saving}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleSaveField}
                        loading={saving}
                      />
                      <Button
                        icon={<CloseOutlined />}
                        onClick={() => setEditField(null)}
                        disabled={saving}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{teamInfo.description || 'Chưa có mô tả'}</span>
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => setEditField('description')}
                      disabled={saving}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button onClick={onClose} disabled={saving || uploading}>
              Đóng
            </Button>
            <Button
              danger
              onClick={handleDeleteTeam}
              loading={saving}
              disabled={uploading}
            >
              Xóa nhóm
            </Button>
          </div>
        </Form>
      </div>

      <Modal
        visible={forbiddenModalVisible}
        onCancel={() => setForbiddenModalVisible(false)}
        footer={
          <Button type="primary" onClick={() => setForbiddenModalVisible(false)}>
            Đóng
          </Button>
        }
        centered
      >
        <div className="flex flex-col items-center text-center py-4">
          <FaExclamationTriangle className="text-red-600 text-4xl mb-3" />
          <h2 className="text-lg font-semibold mb-2">Ra ngoài chơi!</h2>
          <p>
            Chỉ có <strong>trưởng nhóm</strong> mới có quyền thay đổi thông tin hoặc xóa nhóm!
          </p>
        </div>
      </Modal>
    </>
  );
};

export default TeamSetting;
