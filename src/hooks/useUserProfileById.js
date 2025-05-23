import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useUserProfileById = (id) => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setUser(data.profile);
      } catch (error) {
        console.error('Lỗi khi lấy hồ sơ:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProfile();
  }, [token, id]);

  const avatarUrl = user?.avatar_url || null;
  const fullName = user?.full_name || 'Không tên';

  return { user, loading, avatarUrl, fullName };
};

export default useUserProfileById;
