import { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAssignHistory = (tasks) => {
  const [assignHistory, setAssignHistory] = useState({});

  const fetchAssignComments = async (taskId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/teams/task-comments/task/${taskId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const assignComments = res.data.comments
        .filter((c) => c.comment?.match(/\*\* Người dùng (.+?) đã được phân công/))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (assignComments.length === 0) {
        setAssignHistory((prev) => ({ ...prev, [taskId]: [] }));
        return;
      }

      const lastAssign = assignComments[0];
      const match = lastAssign.comment.match(/\*\* Người dùng (.+?) đã được phân công/);
      if (!match) return;

      const userId = match[1];
      if (userId === 'null') {
        setAssignHistory((prev) => ({ ...prev, [taskId]: [] }));
        return;
      }

      const userRes = await axios.get(`http://localhost:5000/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const entry = {
        userId: userId,
        full_name: userRes.data.profile.full_name,
        created_at: new Date(lastAssign.created_at).toLocaleString(),
      };

      setAssignHistory((prev) => ({ ...prev, [taskId]: [entry] }));
    } catch {
      message.error('Không thể tải phân công mới nhất');
    }
  };

  useEffect(() => {
    if (!tasks || !Array.isArray(tasks)) return; // thêm kiểm tra
    tasks.forEach((task) => {
      if (!assignHistory[task.id]) fetchAssignComments(task.id);
    });
  }, [tasks]);

  return { assignHistory, fetchAssignComments };
};

export default useAssignHistory;
