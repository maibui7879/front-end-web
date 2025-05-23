import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';  // Đường dẫn tùy bạn

const baseURL = 'http://localhost:5000';

export const useFetchEvents = () => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tạo axios instance với header Authorization mỗi lần gọi (token có thể thay đổi)
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/event/calendar');
      setEvents(res.data || []);
    } catch (error) {
      console.error('Fetch events error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);  // Nếu token thay đổi thì fetch lại

  return { events, loading, fetchEvents };
};

// Tương tự cho các hook khác:

export const useCreateEvent = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const createEvent = async (eventData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/event/calendar', eventData);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      console.error('Create event error:', error);
      throw error;
    }
  };

  return { createEvent, loading };
};

export const useUpdateEvent = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const updateEvent = async (eventId, eventData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/api/event/calendar/${eventId}/update`, eventData);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      console.error('Update event error:', error);
      throw error;
    }
  };

  return { updateEvent, loading };
};

export const useCancelEvent = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const cancelEvent = async (eventId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/api/event/calendar/${eventId}/cancel`);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      console.error('Cancel event error:', error);
      throw error;
    }
  };

  return { cancelEvent, loading };
};
