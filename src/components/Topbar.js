import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Không thể tải hồ sơ');

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Lỗi khi tải thông tin topbar:', error);
      }
    };

    fetchProfile();
  }, []);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigateProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMenuOpen(false);
    navigate('/auth');
  };

  return (
    <div className="w-full bg-gray-600 shadow px-6 py-3 flex justify-between items-center relative">
      {/* Logo bên trái */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <span className="text-xl font-bold text-white">TeamManager</span>
      </div>

      {/* Avatar và Dropdown */}
      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <span className="hidden md:inline text-white">{user.full_name}</span>
            <img
              src={user.avatar_url || 'https://i.pravatar.cc/100'}
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
            />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-md py-2 z-50">
              <button
                onClick={handleNavigateProfile}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Hồ sơ
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Topbar;
