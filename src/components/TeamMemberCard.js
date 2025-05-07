import React from 'react';
import { Card, Avatar, Typography } from 'antd';

const { Text } = Typography;

const TeamMemberCard = ({ member }) => {
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <Avatar size="large" src={member.avatar_url}>
          {member.full_name?.charAt(0)}
        </Avatar>
        <div>
          <Text strong>{member.full_name}</Text>
          <div className="text-gray-500 text-sm">{member.role}</div>
        </div>
      </div>
    </Card>
  );
};

export default TeamMemberCard;
