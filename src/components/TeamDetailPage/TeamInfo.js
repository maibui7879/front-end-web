import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const TeamInfo = ({ team, creator }) => (
  <div>
    <Title level={2} className="break-words">{team.name}</Title>
    <Text type="secondary" className="block mb-1 break-words">{team.description}</Text>
    {creator && (
      <Text italic type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
        Nhóm được tạo bởi{' '}
        <span className="font-bold">
          {creator.full_name || creator.username || 'người dùng'}
        </span>
      </Text>
    )}
  </div>
);

export default TeamInfo;
