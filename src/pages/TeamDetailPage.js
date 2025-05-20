import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Spin, message, Button, Divider, Row, Col, Drawer, Modal, Form, Input, DatePicker, Switch,notification } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import TeamCreator from '../components/TeamCreator';
import TeamMemberList from '../components/TeamMemberList';
import InviteMemberModal from '../components/InviteMemberModal';
import TeamSetting from '../components/TeamSetting';
<<<<<<< HEAD
import TeamTaskList from '../components/TeamTaskList';
=======
import TaskCard from '../components/TaskCard';
>>>>>>> 8eddac729780ff30de8812e6caecea64cd6d7b5d

const { Title, Text } = Typography;

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [team, setTeam] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
<<<<<<< HEAD

  const activeTab = searchParams.get('tab') || 'members';
=======
  const [showMembers, setShowMembers] = useState(true);
  const [showSetting, setShowSetting] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [showTasks, setShowTasks] = useState(false);
  const [teamTasks, setTeamTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  
>>>>>>> 8eddac729780ff30de8812e6caecea64cd6d7b5d

  useEffect(() => {
    fetchTeamDetail();
  }, [id]);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const fetchTeamDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const teamRes = await axios.get(`http://localhost:5000/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(teamRes.data);

      const creatorId = teamRes.data.creator_id;
      const creatorRes = await axios.get(`http://localhost:5000/api/user/profile/${creatorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreator(creatorRes.data.profile);

      const memberRes = await axios.get(`http://localhost:5000/api/teams/${id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(memberRes.data);
    } catch (error) {
      message.error('Không thể tải thông tin nhóm');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    const token = localStorage.getItem('token');
    try {
      const confirmDelete = window.confirm('Bạn chắc chắn muốn xóa nhóm này?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/api/teams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Nhóm đã được xóa');
        navigate('/team');
      }
    } catch (error) {
      message.error('Không thể xóa nhóm');
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (loading || !team) {
    return (
      <div className="text-center py-10">
        <Spin tip="Đang tải thông tin nhóm..." />
      </div>
    );
  }

  const SidebarButton = ({ icon, label, onClick, danger, isActive }) => (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center px-4 py-3 w-full rounded transition font-medium text-base ${
          danger
            ? 'text-red-500 hover:text-red-600'
            : isActive
            ? 'text-blue-700 font-semibold'
            : 'hover:text-blue-700'
        }`}
      >
        <i className={`fa ${icon} w-6 text-[18px] text-center mr-4`} />
        <span>{label}</span>
      </button>
    </li>
  );
  const handleAddTask = async (values) => {
    try {
      const token = localStorage.getItem('token');
      notification.success({
        message: 'Thành công',
        description: 'Công việc đã được tạo thành công.',
      });
      setAddTaskModalVisible(false);
      form.resetFields();


      await axios.post(
        `http://localhost:5000/api/tasks`,
        {
          title: values.title,
          description: values.description,
          start_time: values.start_time.format("YYYY-MM-DD HH:mm:ss"),
          end_time: values.end_time.format("YYYY-MM-DD HH:mm:ss"),
          team_id: parseInt(id),
          status: 'todo',       // giá trị mặc định
          priority: 'medium'    // giá trị mặc định
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      message.success('Tạo công việc thành công!');
      setAddTaskModalVisible(false);
      form.resetFields();
    } catch (error) {
      notification.error({
      message: 'Thất bại',
      description: 'Tạo công việc không thành công. Vui lòng thử lại.',
    });
    }
  };

  const fetchTeamTasks = async () => {
    setLoadingTasks(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/tasks/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamTasks(res.data.tasks || res.data); // tuỳ API trả về
    } catch (err) {
      setTeamTasks([]);
      message.error('Không thể tải danh sách công việc');
    } finally {
      setLoadingTasks(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <div className={`flex-1 mr-80 ${sidebarVisible ? 'mr-80' : 'mr-8'} `}>
        <Title level={2}>{team.name}</Title>
        <Text type="secondary">{team.description}</Text>

        <div className="mt-4">
          <TeamCreator creator={creator} />
        </div>

        {activeTab === 'members' && (
          <div className="mt-6">
            <TeamMemberList members={members} onInviteClick={() => setInviteModalOpen(true)} teamId={team.id} />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="mt-6">
            <TeamTaskList teamId={team.id} />
          </div>
        )}

        {activeTab === 'setting' && (
          <div className="mt-6">
            <TeamSetting team={team} members={members} onClose={() => setActiveTab('members')} onSave={fetchTeamDetail} />
          </div>
        )}

        <InviteMemberModal
          visible={inviteModalOpen}
          onCancel={() => setInviteModalOpen(false)}
          onInvite={fetchTeamDetail}
          teamId={id}
        />

        {showTasks && !showSetting && (
          <div className="mt-6">
            <Typography.Title level={4}>Danh sách công việc của nhóm</Typography.Title>
            {loadingTasks ? (
              <Spin tip="Đang tải danh sách công việc..." />
            ) : teamTasks.length === 0 ? (
              <div className="text-gray-500">Chưa có công việc nào</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {teamTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`w-80 p-4 bg-white/60 rounded-lg shadow-lg fixed right-0 top-0 h-full ${sidebarVisible ? '' : 'hidden'}`}>
        <div className="flex flex-col items-center mb-6 mt-32">
          <img
            src={team.avatar_url || '/default-avatar.png'}
            alt={team.name}
            className="rounded-full w-20 h-20 object-cover mb-4"
          />
          <Title level={4}>{team.name}</Title>
          <Text type="secondary">{team.description}</Text>
        </div>

        <Divider />
        <ul className="space-y-2 px-2">
          <SidebarButton
            icon="fa-users"
            label="Xem thành viên"
            isActive={activeTab === 'members'}
            onClick={() => setActiveTab('members')}
          />
          <SidebarButton
            icon="fa-solid fa-plus"
            label="thêm task"
            onClick={() => setAddTaskModalVisible(true)}
          />
          <SidebarButton
            icon="fa-tasks"
            label="Xem task"
<<<<<<< HEAD
            isActive={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
=======
            onClick={() => {
              setShowTasks((prev) => {
                const next = !prev;
                if (next) fetchTeamTasks();
                return next;
              });
              setShowMembers(false);
              setShowSetting(false);
            }}
>>>>>>> 8eddac729780ff30de8812e6caecea64cd6d7b5d
          />
          <SidebarButton
            icon="fa-cog"
            label="Cài đặt"
            isActive={activeTab === 'setting'}
            onClick={() => setActiveTab('setting')}
          />
          <SidebarButton icon="fa-trash" label="Xóa nhóm" danger onClick={handleDeleteTeam} />
        </ul>
      </div>

      <button
        className={`fixed top-15 z-50 transition-all duration-300 mr-4 
          ${sidebarVisible ? 'right-80' : 'right-8'} 
          border border-gray-300 shadow-md bg-white rounded-lg p-2 
          hover:shadow-lg hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={toggleSidebar}
      >
        <MenuOutlined />
      </button>
      <Modal
        title="Thêm công việc mới"
        open={addTaskModalVisible}
        onCancel={() => {
          setAddTaskModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTask}
          initialValues={{
            is_recurring: false,
            status: 'todo',
            priority: 'medium'
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề công việc" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết công việc" />
          </Form.Item>

          {/* NEW: Trạng thái */}
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Input.Group compact>
              <Form.Item name="status" noStyle>
                <select className="w-full border px-3 py-2 rounded">
                  <option value="todo">Chưa làm</option>
                  <option value="in_progress">Đang làm</option>
                  <option value="done">Hoàn thành</option>
                </select>
              </Form.Item>
            </Input.Group>
          </Form.Item>

          {/* NEW: Mức độ ưu tiên */}
          <Form.Item
            name="priority"
            label="Mức độ ưu tiên"
            rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
          >
            <Input.Group compact>
              <Form.Item name="priority" noStyle>
                <select className="w-full border px-3 py-2 rounded">
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                </select>
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item
            name="start_time"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="end_time"
            label="Thời gian kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="is_recurring"
            label="Lặp lại"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setAddTaskModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo công việc
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

    </div>
    
  );
};

export default TeamDetailPage;
