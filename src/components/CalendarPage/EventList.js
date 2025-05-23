import React, { useState, useEffect } from 'react';
import { List, Button, Tag, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const STORAGE_KEY = 'selectedDate';

const EventList = ({ events, onEdit, onDelete }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? dayjs(saved) : dayjs();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedDate.toISOString());
  }, [selectedDate]);

  const goPreviousDay = () => {
    setSelectedDate(selectedDate.subtract(1, 'day'));
  };

  const goNextDay = () => {
    setSelectedDate(selectedDate.add(1, 'day'));
  };

  const items = [];

  events.forEach(ev => {
    const start = dayjs(ev.start_time);
    const end = dayjs(ev.end_time);
    const isInRange = selectedDate.isBetween(
      start.startOf('day'),
      end.endOf('day'),
      null,
      '[]'
    );

    if (!isInRange) return;

    const isStart = selectedDate.isSame(start, 'day');
    const isEnd = selectedDate.isSame(end, 'day');

    if (isStart) {
      items.push({
        key: `${ev.id}-start`,
        time: start.format('HH:mm'),
        title: ev.title,
        tag: <Tag color="green">Sự kiện bắt đầu</Tag>,
        original: ev,
      });
    }

    if (!isStart && !isEnd) {
      items.push({
        key: `${ev.id}-ongoing`,
        time: '',
        title: ev.title,
        tag: <Tag color="blue">Đang diễn ra</Tag>,
        original: ev,
      });
    }

    if (isEnd) {
      items.push({
        key: `${ev.id}-end`,
        time: end.format('HH:mm'),
        title: ev.title,
        tag: <Tag color="red">Sự kiện kết thúc</Tag>,
        original: ev,
      });
    }
  });

  return (
    <>
      <div className="mb-4 md:w-1/3 flex justify-center items-center gap-2">
        <Button onClick={goPreviousDay} icon={<FaChevronLeft />} />
        <DatePicker
          value={selectedDate}
          onChange={date => setSelectedDate(date || dayjs())}
          allowClear={false}
          style={{ flexGrow: 1 }}
        />
        <Button onClick={goNextDay} icon={<FaChevronRight />} />
      </div>

      <List
        dataSource={items}
        renderItem={item => (
          <List.Item
            key={item.key}
            className="bg-white shadow-lg p-4 md:w-1/3 rounded-lg flex justify-start mb-4"
            actions={[
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => onEdit(item.original)}
                key="edit"
              />,
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                onClick={() => onDelete(item.original)}
                key="delete"
              />,
            ]}
          >
            <List.Item.Meta
              title={
                <div className="space-y-1 p-4">
                  {item.time && (
                    <div className="text-sm font-semibold ">{item.time}</div>
                  )}
                  <div>{item.title}</div>
                  <div>{item.tag}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default EventList;
