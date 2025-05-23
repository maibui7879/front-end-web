import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const baseURL = 'http://localhost:5000';

export const useFetchTeamEvents = (teamId) => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const fetchTeamEvents = async () => {
    if (!teamId) {
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/event/team-calendar/${teamId}`);
      setEvents(res.data || []);
    } catch (error) {
      console.error('Fetch team events error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeamEvents();
  }, [teamId, token]);

  return { events, loading, fetchTeamEvents };
};

export const useCreateTeamEvent = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const createTeamEvent = async (eventData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/event/team-calendar', eventData);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      console.error('Create team event error:', error);
      throw error;
    }
  };

  return { createTeamEvent, loading };
};

export const useUpdateTeamEvent = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const updateTeamEvent = async (eventId, eventData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `/api/event/team-calendar/${eventId}/update`,
        eventData
      );
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      console.error('Update team event error:', error);
      throw error;
    }
  };

  return { updateTeamEvent, loading };
};

export const useDeleteTeamEvent = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const deleteTeamEvent = async (eventId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/api/event/team-calendar/${eventId}/cancel`);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      console.error('Delete team event error:', error);
      throw error;
    }
  };

  return { deleteTeamEvent, loading };
};
