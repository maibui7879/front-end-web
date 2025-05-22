import React, { useEffect, useState, useContext } from 'react';
import { Typography, Button, message } from 'antd';
import TeamMemberCard from './TeamMemberCard';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const { Title } = Typography;

const TeamMemberList = ({ onInviteClick, teamId }) => {
    const { user, token } = useContext(AuthContext);
    const [members, setMembers] = useState([]);

    const fetchMembers = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/teams/${teamId}/members`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(res.data);
        } catch (err) {
            message.error('Không thể tải danh sách thành viên');
        }
    };

    useEffect(() => {
        if (teamId) fetchMembers();
    }, [teamId]);

    const currentUser = members.find((m) => m.id === user?.id);

    return (
        <div>
            <div className="flex justify-between items-center mt-8 mb-4">
                <Title level={4}>Thành viên nhóm</Title>
                <Button type="primary" onClick={onInviteClick}>
                    Mời thành viên
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.map((member) => (
                    <TeamMemberCard
                        key={member.id}
                        member={member}
                        teamId={teamId}
                        canManage={['creator', 'admin'].includes(currentUser?.role)}
                        onChange={fetchMembers}
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamMemberList;
