import React from 'react';
import { Tag } from 'antd';

const AssignCell = ({ record, assignHistory, onOpenAssignModal }) => {
  const entries = assignHistory[record.id] || [];
  const displayName = entries.length === 0 ? 'Chưa phân công' : entries[0].full_name;
  const color = entries.length === 0 ? 'default' : 'blue';

  return (
    <Tag
      color={color}
      style={{ cursor: 'pointer' }}
      onClick={() => onOpenAssignModal(record.id)}
    >
      {displayName}
    </Tag>
  );
};

export default AssignCell;
