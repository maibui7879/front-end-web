import React from 'react';
import { Avatar, Typography, Card } from 'antd';

const { Text: AntdText } = Typography; // Renaming to avoid conflict

const TeamCreator = ({ creator }) => {
  return (
    <div>
      <Card title="Người tạo nhóm">
        {creator ? (
          <div className="flex items-center gap-4">
            <Avatar size="large" src={creator.avatar_url}>
              {creator.full_name?.charAt(0)}
            </Avatar>
            <div>
              <AntdText strong>{creator.full_name}</AntdText>
              <div className="text-sm text-gray-500">{creator.email}</div>
            </div>
          </div>
        ) : (
          <AntdText>Không có thông tin người tạo</AntdText>
        )}
      </Card>
    </div>
  );
};

export default TeamCreator;
