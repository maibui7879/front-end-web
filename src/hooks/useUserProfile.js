import { useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { AuthContext } from '../contexts/AuthContext';

const useUserProfile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const fetchUserProfile = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Lỗi khi lấy hồ sơ:', error);
      message.error('Không thể tải hồ sơ người dùng.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullName = async () => {
    if (!token) return null;
    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch full name');
      const data = await res.json();
      return data.full_name || null;
    } catch (error) {
      console.error('Lỗi khi lấy tên đầy đủ:', error);
      message.error('Không thể tải tên đầy đủ người dùng.');
      return null;
    }
  };

  const fetchAvatar = async () => {
    if (!token) return null;
    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch avatar');
      const data = await res.json();
      return data.avatar_url || null;
    } catch (error) {
      console.error('Lỗi khi lấy avatar:', error);
      message.error('Không thể tải avatar người dùng.');
      return null;
    }
  };

  return { user, loading, fetchFullName, fetchAvatar };
};

export default useUserProfile;
