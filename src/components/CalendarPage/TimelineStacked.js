import React from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

dayjs.extend(isoWeek);

// Danh sách màu pastel mát mắt, dễ chịu
const COLORS = [
  '#A8DADC', // pastel blue
  '#F1FAEE', // pastel cream
  '#FFE066', // pastel yellow
  '#BFD8B8', // pastel green
  '#FFADAD', // pastel red/pink
  '#CDB4DB', // pastel purple
  '#FFC6FF', 
];

// Hàm hash đơn giản từ id sang chỉ số màu
const getColorIndexFromId = (id) => {
  let hash = 0;
  const str = id.toString();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLORS.length;
};

const TimelineStacked = ({ events, selectedDate, setSelectedDate, onEventClick }) => {
  const weekStart = selectedDate.startOf('isoWeek');
  const weekEnd = weekStart.add(7, 'day').endOf('day');
  const totalMinutes = 7 * 24 * 60;

  const eventsOfWeek = events.filter(ev => {
    const start = dayjs(ev.start_time);
    const end = dayjs(ev.end_time);
    return start.isBefore(weekEnd) && end.isAfter(weekStart);
  });

  const calcPosition = (ev) => {
    const start = dayjs(ev.start_time);
    const end = dayjs(ev.end_time);

    const startMinutes = Math.max(start.diff(weekStart, 'minute'), 0);
    const endMinutes = Math.min(end.diff(weekStart, 'minute'), totalMinutes);

    const leftPercent = (startMinutes / totalMinutes) * 100;
    const widthPercent = ((endMinutes - startMinutes) / totalMinutes) * 100;

    return { leftPercent, widthPercent };
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Sự kiện tuần</h4>
        <div className="flex items-center space-x-2 text-sm mb-4">
          <button
            onClick={() => setSelectedDate(selectedDate.subtract(1, 'week'))}
            className="p-2 rounded hover:bg-gray-300"
            title="Tuần trước"
          >
            <FaChevronLeft />
          </button>

          <span className="font-medium text-lg text-gray-700">
            {weekStart.format('DD/MM/YYYY')} - {weekEnd.format('DD/MM/YYYY')}
          </span>

          <button
            onClick={() => setSelectedDate(selectedDate.add(1, 'week'))}
            className="p-2 rounded hover:bg-gray-300"
            title="Tuần sau"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {eventsOfWeek.length === 0 && (
        <p className="text-gray-500">Không có sự kiện nào</p>
      )}

      <div className="relative border border-gray-300 h-12 p-2 bg-gray-50 select-none mb-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full bg-gray-200"
            style={{ left: `${(i / 7) * 100}%`, width: 1 }}
          >
            <div
              className="absolute -top-4 -left-10 w-10 text-center text-xs text-gray-400"
              style={{ userSelect: 'none' }}
            >
              {weekStart.add(i, 'day').format('dd DD')}
            </div>
          </div>
        ))}
        {eventsOfWeek.map(ev => {
        const { leftPercent, widthPercent } = calcPosition(ev);
        const bgColor = COLORS[getColorIndexFromId(ev.id)];
        return (
            <div
            key={ev.id}
            title={`${ev.title}\n${dayjs(ev.start_time).format('DD/MM HH:mm')} - ${dayjs(ev.end_time).format('DD/MM HH:mm')}`}
            className="absolute h-9 px-2 py-1 truncate cursor-pointer"
            style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, backgroundColor: bgColor, color: '#222' }}
            onClick={() => onEventClick(ev)}
            >
            {ev.title}
            </div>
        );
        })}
      </div>
    </div>
  );
};

export default TimelineStacked;
