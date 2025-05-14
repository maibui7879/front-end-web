import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="w-20 md:w-64 text-gray-700 bg-white/60 border-r border-gray-300 fixed top-0 left-0 h-full transition-all duration-300 z-50 backdrop-blur-lg shadow-md rounded-tr-2xl">
      {user && (
        <div className="flex flex-col items-center md:flex-row md:items-center gap-3 px-4 py-4">
          <img
            src={user.avatar_url || 'https://i.pravatar.cc/100'}
            alt="Avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
          />
          <span className="hidden md:inline text-base font-semibold">{user.full_name}</span>
        </div>
      )}

      <div className="border-t border-gray-300 mx-4" />

      <ul className="mt-6 space-y-2 px-3">
        <SidebarItem icon="fa-home" label="Trang Chủ" to="/home" />
        <SidebarItem icon="fa-users" label="Đội Nhóm" to="/team" />
        <SidebarItem icon="fa-user" label="Hồ Sơ" to="/profile" />
        <SidebarItem icon="fa-briefcase" label="Công việc cá nhân" to="/personal-tasks" />
      </ul>

      <div className="border-t border-gray-300 my-6 mx-4" />

      <div className="absolute bottom-5 w-full px-3">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 w-full rounded text-red-500 hover:text-red-600 transition font-medium"
        >
          <i className="fa fa-sign-out w-6 text-[18px] text-center mr-4" />
          <span className="hidden md:inline">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, to }) => {
  const navigate = useNavigate();

  return (
    <li>
      <button
        onClick={() => navigate(to)}
        className="flex items-center px-4 py-3 w-full rounded hover:text-blue-700 transition text-lg font-medium"
      >
        <i className={`fa ${icon} w-6 text-[18px] text-center mr-4`} />
        <span className="hidden md:inline">{label}</span>
      </button>
    </li>
  );
};

export default Sidebar;
