import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { FaFlag, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import dayjs from 'dayjs';

const { Text } = Typography;

const statusColor = {
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
};

const priorityColor = {
  high: 'red',
  medium: 'gold',
  low: 'green',
};

const statusLabel = {
  todo: 'Chưa làm',
  in_progress: 'Đang làm',
  done: 'Hoàn thành',
};

const priorityLabel = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const TaskCard = ({ task }) => {
  const formatTime = (time) =>
    time ? dayjs(time).format('HH:mm DD/MM/YYYY') : '';

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 bg-white/90">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Text strong className="text-lg">{task.title}</Text>
          <Tag color={priorityColor[task.priority]} className="uppercase font-semibold">
            <FaFlag className="inline mr-1" /> {priorityLabel[task.priority]}
          </Tag>
        </div>
        <div className="text-gray-600 text-sm flex items-center gap-2">
          <FaClipboardList /> {task.description}
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-1">
          <Tag color={statusColor[task.status]}>{statusLabel[task.status]}</Tag>
          {(task.start_time || task.end_time) && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <FaCalendarAlt />
              {formatTime(task.start_time)}
              {task.end_time && (
                <>
                  {' '}→{' '}
                  {formatTime(task.end_time)}
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard; 