import React, { useState, useRef, useEffect } from 'react';
import CalendarComponent from '../components/CalendarComponent';

const PersonalTasksPage = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState({
    name: '',
    note: '',
    time: '',
    startDate: '',
    endDate: '',
  });
  const [taskList, setTaskList] = useState([]);
  const calendarRef = useRef(null);

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSaveTask = () => {
    if (task.name && task.startDate) {
      setTaskList([...taskList, task]);
      setTask({ name: '', note: '', time: '', startDate: '', endDate: '' });
      setModalVisible(false);
    }
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setCalendarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Nút mở modal thêm công việc */}
      <button
        onClick={() => setModalVisible(true)}
        className="fixed right-6 bottom-6 bg-blue-700 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all z-50"
      >
        <i className="fa fa-plus" />
      </button>

      {/* Nút mở lịch */}
      <button
        onClick={toggleCalendar}
        className="absolute top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
      >
        <i className="fa fa-calendar-alt" />
      </button>

      {/* Overlay lịch */}
      {calendarVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-40 p-4 bg-gray-800 bg-opacity-50">
          <div
            ref={calendarRef}
            className="relative w-1/2 h-3/4 bg-white shadow-lg rounded-lg p-4 overflow-auto"
            style={{ transform: 'translateX(100px)' }}
          >
            <CalendarComponent tasks={taskList} />
            <button
              onClick={toggleCalendar}
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
            >
              <i className="fa fa-times" />
            </button>
          </div>
        </div>
      )}

      {/* Modal thêm công việc */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Thêm Công Việc</h2>
            <div className="space-y-3">
              <input
                name="name"
                value={task.name}
                onChange={handleChange}
                placeholder="Tên công việc"
                className="w-full p-2 border rounded"
              />
              <input
                name="note"
                value={task.note}
                onChange={handleChange}
                placeholder="Ghi chú"
                className="w-full p-2 border rounded"
              />
              <input
                name="time"
                value={task.time}
                onChange={handleChange}
                placeholder="Thời gian (ví dụ: 2 giờ)"
                className="w-full p-2 border rounded"
              />
              <input
                name="startDate"
                value={task.startDate}
                onChange={handleChange}
                type="date"
                className="w-full p-2 border rounded"
              />
              <input
                name="endDate"
                value={task.endDate}
                onChange={handleChange}
                type="date"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị danh sách công việc */}
      <div className="p-6">
        {taskList.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border text-left">Tên công việc</th>
                  <th className="px-4 py-2 border text-left">Ghi chú</th>
                  <th className="px-4 py-2 border text-left">Thời gian</th>
                  <th className="px-4 py-2 border text-left">Ngày bắt đầu</th>
                  <th className="px-4 py-2 border text-left">Ngày kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {taskList.map((t, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{t.name}</td>
                    <td className="px-4 py-2 border">{t.note}</td>
                    <td className="px-4 py-2 border">{t.time}</td>
                    <td className="px-4 py-2 border">{t.startDate}</td>
                    <td className="px-4 py-2 border">{t.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 text-gray-500 italic">Chưa có công việc nào.</p>
        )}
      </div>
    </div>
  );
};

export default PersonalTasksPage;
