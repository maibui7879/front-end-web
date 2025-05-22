import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Avatar,
  Typography,
  Dropdown,
  Menu,
  Modal,
  Input,
  Select,
  message,
  Button,
} from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

const TeamMemberCard = ({ member, teamId, onChange }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [newRole, setNewRole] = useState(member.role);
  const [forbiddenModal, setForbiddenModal] = useState(false);

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/profile/${member.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAvatarUrl(
          res.data.profile.avatar_url || "https://i.pravatar.cc/100",
        );
      } catch (error) {
        setAvatarUrl("https://i.pravatar.cc/100");
      }
    };
    fetchUserProfile();
  }, [member.id, token]);

  const confirmRemoveMember = async () => {
    console.log("Click gọi confirmRemoveMember");
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/teams/member/${teamId}/remove/${member.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Response:", res);

      if (res.status === 200) {
        message.success("Đã xóa thành viên");
        onChange();
      } else {
        console.error("Lỗi từ server:", res);
        message.error("Lỗi khi xóa thành viên");
      }
    } catch (err) {
      console.error("Lỗi khi gửi request:", err);
      message.error("Lỗi khi xóa thành viên");
    }
  };

  const handleChangeRole = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/teams/member/${teamId}/change-role/${member.id}`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 403) {
        setForbiddenModal(true);
        return;
      }

      message.success("Cập nhật vai trò thành công");
      setRoleModalVisible(false);
      onChange();
    } catch (err) {
      message.error("Không thể cập nhật vai trò");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate(`/profile/${member.id}`)}>
        Xem hồ sơ
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setRoleModalVisible(true)}>
        Thay đổi vai trò
      </Menu.Item>
      <Menu.Item key="4" danger onClick={confirmRemoveMember}>
        Xóa thành viên khỏi nhóm
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Card className="rounded-xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="large" src={avatarUrl}>
              {member.full_name?.charAt(0)}
            </Avatar>
            <div>
              <Text strong>{member.full_name}</Text>
              <div className="text-gray-500 text-sm">{member.role}</div>
            </div>
          </div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <EllipsisOutlined className="cursor-pointer text-xl" />
          </Dropdown>
        </div>
      </Card>

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
            Chỉ có <span className="font-semibold">trưởng nhóm</span> mới có
            quyền thay đổi thông tin hoặc xóa nhóm!
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

export default TeamMemberCard;
