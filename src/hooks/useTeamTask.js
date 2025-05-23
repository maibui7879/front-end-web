import { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useTeamTasks = (teamId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/team/${teamId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(res.data.personalTasks || []);
    } catch {
      message.error('Không thể tải danh sách task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchTasks();
  }, [teamId]);

  return { tasks, loading, fetchTasks };
};

export default useTeamTasks;
