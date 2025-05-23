import { useState } from 'react';
import axios from 'axios';
import toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
const useTeamSetting = ({ team, onClose, onSave }) => {
    const navigate = useNavigate();
    const [teamInfo, setTeamInfo] = useState({
    name: team.name,
    description: team.description,
    avatar_url: team.avatar_url || '',
    });
    const [editField, setEditField] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('token');

    const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    setUploading(true);
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dkshpgp3n/image/upload', formData);
      const url = res.data.secure_url;
      setTeamInfo((prev) => ({ ...prev, avatar_url: url }));

      await axios.put(
        `http://localhost:5000/api/teams/${team.id}`,
        { avatar_url: url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Tải ảnh lên thành công');
      onSave();
    } catch (error) {
      toast.error('Lỗi khi tải ảnh');
    } finally {
      setUploading(false);
    }

    return false;
    };

    const handleSaveField = async () => {
        if (!teamInfo.name.trim()) {
        toast.warning('Tên nhóm không được để trống');
        return;
        }

    setSaving(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/teams/${team.id}`,
        teamInfo,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Cập nhật thành công');
      onSave(res.data);
      setEditField(null);
    } catch {
      toast.error('Không thể cập nhật thông tin nhóm');
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
      toast.success('Nhóm đã được xóa');
      navigate('/team', { replace: true })
    } catch {
      toast.error('Không thể xóa nhóm');
    } finally {
      setSaving(false);
    }
  };

return {
    teamInfo,
    setTeamInfo,
    editField,
    setEditField,
    uploading,
    saving,
    handleUpload,
    handleSaveField,
    handleDeleteTeam,
  };
};

export default useTeamSetting
