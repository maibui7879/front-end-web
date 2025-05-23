import React, { useEffect, useState } from 'react';
import { Modal, Select, message, Button, Space } from 'antd';
import useTeamMembers from '../../../../hooks/useTeamMember';
import axios from 'axios';
const { Option } = Select;

const AssignTaskModal = ({ visible, onCancel, taskId, teamId, onAssignSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { members: users, loading: userLoading, error } = useTeamMembers(teamId);

  useEffect(() => {
    if (error) {
      message.error('Không tải được danh sách thành viên');
    }
  }, [error]);

  useEffect(() => {
    if (!visible) setSelectedUserId(null);
  }, [visible]);

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
      onCancel();
      window.location.reload();
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
      onCancel();
      window.location.reload();
    } catch {
      message.error('Lỗi khi hủy phân công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Phân công công việc"
      open={visible}
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
        loading={userLoading}
        allowClear
      >
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.full_name || user.name || 'Không tên'}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AssignTaskModal;
