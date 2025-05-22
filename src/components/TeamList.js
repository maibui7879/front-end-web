import React from 'react';
import { Card, Typography, Empty, Spin, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TeamList = ({ teams, loading }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="text-center py-10">
                <Spin tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    if (teams.length === 0) {
        return <Empty description="Bạn chưa tham gia nhóm nào" />;
    }

    return (
        <div className="space-y-6">
            {teams.map((team) => (
                <Card
                    key={team.id}
                    className="rounded-xl shadow-xl hover:shadow-2xl border border-gray-200 transition-transform duration-200 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/teams/${team.id}`)}
                    bodyStyle={{ padding: 0 }}
                >
                    <div className="relative flex items-center h-40">
                        {/* Background image gradient overlay */}
                        <div
                            className="absolute right-0 top-0 h-full w-1/4"
                            style={{
                                backgroundImage: `url(${team.avatar_url || ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.9,
                                maskImage: 'linear-gradient(to right, black 60%, transparent)',
                                WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent)',
                            }}
                        />

                        <div className="relative z-10 flex items-center gap-4 px-6 w-full">
                            <Avatar src={team.avatar_url || undefined} size={64} alt={team.name}>
                                {team.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                                <Title level={4} className="mb-1">
                                    {team.name}
                                </Title>
                                <Text type="secondary" className="line-clamp-2">
                                    {team.description}
                                </Text>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default TeamList;
