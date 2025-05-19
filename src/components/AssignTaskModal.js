import React, { useEffect, useState } from 'react';
import { Modal, Select, message, Button, Space } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AssignTaskModal = ({ visible, onCancel, taskId, teamId, onAssignSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (!visible || !teamId) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/teams/${teamId}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const memberList = res.data || [];
        const userProfiles = await Promise.all(
          memberList.map(async (member) => {
            try {
              const profileRes = await axios.get(`http://localhost:5000/api/user/profile/${member.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              });
              return {
                id: member.id,
                name: profileRes.data.profile.full_name || 'Không tên',
              };
            } catch {
              return { id: member.id, name: 'Không thể tải tên' };
            }
          })
        );

        setUsers(userProfiles);
      } catch {
        message.error('Không tải được danh sách thành viên');
      }
    };

    fetchUsers();
  }, [visible, teamId]);

  const handleAssign = async () => {
    if (!selectedUserId) {
      message.warning('Vui lòng chọn người được phân công');
      return;
    }
    setLoading(true);
    try {
      await axios.patch(
        'http://localhost:5000/api/teams/task/assign',
        { taskId, userId: selectedUserId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      message.success('Phân công công việc thành công');
      onAssignSuccess();
      onCancel();
    } catch {
      message.error('Lỗi khi phân công công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    setLoading(true);
    try {
      await axios.patch(
        'http://localhost:5000/api/teams/task/assign',
        { taskId, userId: null },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      message.success('Đã hủy phân công');
      onAssignSuccess();
      onCancel();
    } catch {
      message.error('Lỗi khi hủy phân công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Phân công công việc"
      visible={visible}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={handleUnassign} danger loading={loading}>
            Hủy phân công
          </Button>
          <Button onClick={onCancel}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleAssign} loading={loading}>
            Xác nhận
          </Button>
        </Space>
      }
    >
      <Select
        placeholder="Chọn người được phân công"
        style={{ width: '100%' }}
        onChange={(value) => setSelectedUserId(value)}
        value={selectedUserId}
        allowClear
      >
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AssignTaskModal;
