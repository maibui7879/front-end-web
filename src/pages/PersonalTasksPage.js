import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Card } from "antd";
import { FaFlag, FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext"; // Cập nhật path nếu cần

export default function PersonalTaskPage() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!token) return;

    axios.get("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      console.log("Token hiện tại:", token);

      console.log("Dữ liệu nhận về:", res.data);
      const personalTasks = res.data.personalTasks || [];
      setTasks(personalTasks);
    })
    .catch(err => console.error("Lỗi lấy task:", err));
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "bg-gray-200 text-gray-800";
      case "in_progress": return "bg-yellow-200 text-yellow-800";
      case "done": return "bg-green-200 text-green-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return <FaFlag className="text-red-500" />;
      case "medium": return <FaFlag className="text-yellow-500" />;
      case "low": return <FaFlag className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => (
        <Card key={index} className="rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            {getPriorityIcon(task.priority)}
          </div>
          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
            <FaClipboardList /> {task.description}
          </p>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <FaCalendarAlt /> {task.start_time} → {task.end_time}
          </p>
          <p className={`inline-block px-3 py-1 rounded-full text-xs mt-2 ${getStatusColor(task.status)}`}>
            {task.status.toUpperCase()}
          </p>
        </Card>
      ))}
    </div>
  );
}
