import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchTaskComments = async (token, taskId) => {
  const res = await axios.get(`${API_BASE_URL}/teams/task-comments/task/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.comments;
};

export const fetchUserProfile = async (token, userId) => {
  const res = await axios.get(`${API_BASE_URL}/user/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.profile;
};
