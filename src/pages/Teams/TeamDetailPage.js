import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Spin, message, Button, Divider } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import TeamCreator from '../../components/TeamCreator';
import TeamMemberList from '../../components/TeamMemberList';
import InviteMemberModal from '../../components/InviteMemberModal';
import TeamSetting from '../../components/TeamSetting';
import TeamTaskList from '../../components/TeamTaskList';

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

    const activeTab = searchParams.get('tab') || 'members';

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
                        <TeamMemberList
                            members={members}
                            onInviteClick={() => setInviteModalOpen(true)}
                            teamId={team.id}
                        />
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="mt-6">
                        <TeamTaskList teamId={team.id} />
                    </div>
                )}

                {activeTab === 'setting' && (
                    <div className="mt-6">
                        <TeamSetting
                            team={team}
                            members={members}
                            onClose={() => setActiveTab('members')}
                            onSave={fetchTeamDetail}
                        />
                    </div>
                )}

                <InviteMemberModal
                    visible={inviteModalOpen}
                    onCancel={() => setInviteModalOpen(false)}
                    onInvite={fetchTeamDetail}
                    teamId={id}
                />
            </div>

            <div
                className={`w-80 p-4 bg-white/60 rounded-lg shadow-lg fixed right-0 top-0 h-full ${
                    sidebarVisible ? '' : 'hidden'
                }`}
            >
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
                        icon="fa-tasks"
                        label="Xem task"
                        isActive={activeTab === 'tasks'}
                        onClick={() => setActiveTab('tasks')}
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
        </div>
    );
};

export default TeamDetailPage;
