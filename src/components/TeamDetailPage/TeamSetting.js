import React from 'react';
import { Upload, Button, Input, Form, Avatar } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getInitials } from '../../utils/getInitialsAvatar';
import useTeamSetting from '../../hooks/useTeamSetting';

const TeamSetting = ({ team, onClose, onSave }) => {
  const {
    teamInfo,
    setTeamInfo,
    editField,
    setEditField,
    uploading,
    saving,
    handleUpload,
    handleSaveField,
    handleDeleteTeam,
  } = useTeamSetting({ team, onClose, onSave });

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mt-4 mx-auto">
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
                <img src={teamInfo.avatar_url} alt="avatar" className="object-cover w-full h-full rounded-full" />
              ) : (
                <Avatar size={144} className="bg-gray-200 text-gray-800 text-3xl font-bold">
                  {getInitials(teamInfo.name)}
                </Avatar>
              )}
            </Upload>
            <div
              onClick={() => document.querySelector('input[type=file]').click()}
              className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 cursor-pointer"
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}
            >
              <EditOutlined style={{ color: '#1890ff', fontSize: 16 }} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-semibold mb-1 block">Tên nhóm:</label>
              {editField === 'name' ? (
                <div className="flex gap-2 items-center">
                  <Input
                    value={teamInfo.name}
                    onChange={(e) => setTeamInfo((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={saving}
                  />
                  <Button type="primary" icon={<CheckOutlined />} onClick={handleSaveField} loading={saving} />
                  <Button icon={<CloseOutlined />} onClick={() => setEditField(null)} disabled={saving} />
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>{teamInfo.name}</span>
                  <Button icon={<EditOutlined />} size="small" onClick={() => setEditField('name')} disabled={saving} />
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold mb-1 block">Mô tả:</label>
              {editField === 'description' ? (
                <>
                  <Input.TextArea
                    value={teamInfo.description}
                    onChange={(e) => setTeamInfo((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    disabled={saving}
                  />
                  <div className="mt-2 flex gap-2">
                    <Button type="primary" icon={<CheckOutlined />} onClick={handleSaveField} loading={saving} />
                    <Button icon={<CloseOutlined />} onClick={() => setEditField(null)} disabled={saving} />
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span>{teamInfo.description || 'Chưa có mô tả'}</span>
                  <Button icon={<EditOutlined />} size="small" onClick={() => setEditField('description')} disabled={saving} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-start gap-4">
          <Button danger onClick={handleDeleteTeam} loading={saving} disabled={uploading}>Xóa nhóm</Button>
        </div>
      </Form>
    </div>
  );
};

export default TeamSetting;
