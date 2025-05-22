import React, { useEffect, useState, useContext, useRef } from 'react';
import { Table, Avatar, Typography, Dropdown, Menu, Modal, Select, message, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '.../contexts/AuthContext'; // bỏ import này theo yêu cầu
import { FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const { Text } = Typography;
const { Option } = Select;

const TeamMemberList = ({ onInviteClick, teamId }) => {
  // Lấy token trực tiếp từ localStorage
  const token = localStorage.getItem('token');
  const [members, setMembers] = useState([]);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [forbiddenModal, setForbiddenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownAnchor, setDropdownAnchor] = useState(null);
  const navigate = useNavigate();

  const avatarNameRefs = useRef({}); // lưu ref cho từng member để dropdown hiển thị cạnh tên

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/teams/${teamId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const membersWithAvatar = await Promise.all(
        res.data.map(async (m) => {
          try {
            const prof = await axios.get(`http://localhost:5000/api/user/profile/${m.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return { ...m, avatarUrl: prof.data.profile.avatar_url || 'https://i.pravatar.cc/100' };
          } catch {
            return { ...m, avatarUrl: 'https://i.pravatar.cc/100' };
          }
        })
      );
      setMembers(membersWithAvatar);
    } catch (err) {
      message.error('Không thể tải danh sách thành viên');
    }
  };

  useEffect(() => {
    if (teamId) fetchMembers();
  }, [teamId]);

  // Giả định user id lưu ở localStorage (hoặc token decode)
  const currentUserId = localStorage.getItem('userId');
  const currentUser = members.find((m) => m.id === currentUserId);
  const canManage = ['creator', 'admin'].includes(currentUser?.role);

  const confirmRemoveMember = async (member) => {
    Modal.confirm({
      title: `Xác nhận xóa thành viên ${member.full_name}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await axios.delete(`http://localhost:5000/api/teams/member/${teamId}/remove/${member.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 200) {
            message.success('Đã xóa thành viên');
            fetchMembers();
          } else {
            message.error('Lỗi khi xóa thành viên');
          }
        } catch (err) {
          message.error('Lỗi khi xóa thành viên');
        }
      },
    });
  };

  const handleChangeRole = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/teams/member/${teamId}/change-role/${selectedMember.id}`,
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
    } catch (err) {
      message.error('Không thể cập nhật vai trò');
    }
  };

  const menu = (member) => (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate(`/profile/${member.id}`)}>
        Xem hồ sơ
      </Menu.Item>
      {canManage && (
        <>
          <Menu.Item
            key="2"
            onClick={() => {
              setSelectedMember(member);
              setNewRole(member.role);
              setRoleModalVisible(true);
              setDropdownVisible(false);
            }}
          >
            Thay đổi vai trò
          </Menu.Item>
          <Menu.Item key="3" danger onClick={() => { setDropdownVisible(false); confirmRemoveMember(member); }}>
            Xóa thành viên khỏi nhóm
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const columns = [
    {
      title: 'Thành viên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, member) => (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          ref={(el) => {
            if (el) avatarNameRefs.current[member.id] = el;
          }}
          onClick={(e) => {
            setSelectedMember(member);
            setDropdownAnchor(avatarNameRefs.current[member.id]);
            setDropdownVisible(true);
            e.stopPropagation(); // tránh kích hoạt onRow click nếu có
          }}
        >
          <Avatar src={member.avatarUrl} alt={text}>
            {text?.charAt(0)}
          </Avatar>
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Text>{role}</Text>,
      width: 120,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mt-8 mb-4">
        <Typography.Title level={4}>Thành viên nhóm</Typography.Title>
        <Button type="primary" onClick={onInviteClick} disabled={false}>
          Mời thành viên
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={members}
        pagination={false} // bỏ footer pagination
        // bỏ onRow onClick vì đã xử lý click trên avatar + tên
      />

      {selectedMember && dropdownAnchor && (
        <Dropdown
          overlay={menu(selectedMember)}
          visible={dropdownVisible}
          onVisibleChange={(flag) => setDropdownVisible(flag)}
          getPopupContainer={() => dropdownAnchor}
          placement="bottomLeft"
        >
          <div />
        </Dropdown>
      )}

      <Modal
        title="Thay đổi vai trò"
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        onOk={handleChangeRole}
      >
        <Select className="w-full" value={newRole} onChange={setNewRole}>
          <Option value="member">Thành viên</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </Modal>

      <Modal
        open={forbiddenModal}
        onCancel={() => setForbiddenModal(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col items-center text-center py-4">
          <FaExclamationTriangle className="text-red-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold mb-1">Ra ngoài chơi!</h2>
          <p className="text-gray-600">
            Chỉ có <span className="font-semibold">trưởng nhóm</span> mới có quyền thay đổi thông tin hoặc xóa nhóm!
          </p>
          <div className="mt-5">
            <Button type="primary" onClick={() => setForbiddenModal(false)}>
              Nuh uh
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamMemberList;
