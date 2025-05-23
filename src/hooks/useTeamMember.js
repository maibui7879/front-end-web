import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { message, Modal } from 'antd';
import { getInitials } from '../utils/getInitialsAvatar';  // Đường dẫn tương ứng

const API_BASE = 'http://localhost:5000/api';

const useTeamMembers = (teamId) => {
  const token = localStorage.getItem('token');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [forbiddenModal, setForbiddenModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownAnchor, setDropdownAnchor] = useState(null);
  const avatarNameRefs = useRef({});

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teams/${teamId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const membersWithAvatar = await Promise.all(
        res.data.map(async (m) => {
          try {
            const prof = await axios.get(`${API_BASE}/user/profile/${m.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const avatarUrl = prof.data.profile.avatar_url || null;
            // Dùng full_name của member hoặc profile để lấy chữ cái
            const fullName = m.full_name || prof.data.profile.full_name || "";
            const initials = getInitials(fullName);
            return { ...m, avatarUrl, initials };
          } catch {
            const initials = getInitials(m.full_name || "");
            return { ...m, avatarUrl: null, initials };
          }
        })
      );

      setMembers(membersWithAvatar);
    } catch {
      message.error('Không thể tải danh sách thành viên');
    }
  };

  useEffect(() => {
    if (teamId) fetchMembers();
  }, [teamId]);

  const confirmRemoveMember = async (member) => {
    Modal.confirm({
      title: `Xác nhận xóa thành viên ${member.full_name}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await axios.delete(`${API_BASE}/teams/member/${teamId}/remove/${member.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 200) {
            message.success('Đã xóa thành viên');
            fetchMembers();
          } else {
            message.error('Lỗi khi xóa thành viên');
          }
        } catch {
          message.error('Lỗi khi xóa thành viên');
        }
      },
    });
  };

  const handleChangeRole = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/teams/member/${teamId}/change-role/${selectedMember.id}`,
        { role: newRole },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 403) {
        setForbiddenModal(true);
        return;
      }

      message.success('Cập nhật vai trò thành công');
      setRoleModalVisible(false);
      fetchMembers();
    } catch {
      message.error('Không thể cập nhật vai trò');
    }
  };

  const currentUserId = localStorage.getItem('userId');
  const currentUser = members.find((m) => m.id === currentUserId);
  const canManage = ['creator', 'admin'].includes(currentUser?.role);

  return {
    members,
    selectedMember,
    newRole,
    roleModalVisible,
    forbiddenModal,
    dropdownVisible,
    dropdownAnchor,
    avatarNameRefs,
    canManage,
    setSelectedMember,
    setNewRole,
    setRoleModalVisible,
    setForbiddenModal,
    setDropdownVisible,
    setDropdownAnchor,
    confirmRemoveMember,
    handleChangeRole,
    fetchMembers,
  };
};

export default useTeamMembers;
