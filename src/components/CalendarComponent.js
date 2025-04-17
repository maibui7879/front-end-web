// src/components/CalendarComponent.js
import React, { useState } from 'react';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Hàm lấy số ngày trong tháng
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Hàm lấy ngày bắt đầu của tháng
  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays = [];

    // Thêm các ô trống cho những ngày trước khi ngày đầu tiên của tháng
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="empty-day" />);
    }

    // Thêm các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(
        <div key={i} className="calendar-day text-center p-4 cursor-pointer hover:bg-gray-200 rounded">
          {i}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="calendar-container bg-white p-4 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          className="text-xl p-2 text-gray-600 hover:bg-gray-200 rounded"
        >
          &lt;
        </button>
        <span className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </span>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          className="text-xl p-2 text-gray-600 hover:bg-gray-200 rounded"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-bold text-gray-600">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default CalendarComponent;
