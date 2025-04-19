import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Không thể lấy thông tin người dùng');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchProfile();
  }, []);

  const avatarSrc =
    user?.avatar_url || 'https://i.pravatar.cc/40';

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gray-800 text-white fixed left-0 top-0 h-full transition-all duration-300 z-50`}
    >
      {/* Avatar + nút toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600 relative">
        <div className="flex items-center space-x-3">
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          {sidebarOpen && user && (
            <div>
              <p className="font-semibold text-sm">Mẹ mày béo</p>
              <p className="text-xs text-gray-300 truncate max-w-[10rem]">
                {user.full_name}
              </p>
            </div>
          )}
        </div>

        {/* Nút toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow"
          title="Thu gọn"
        >
          <i className={`fa ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
        </button>
      </div>

      {/* Menu */}
      <ul className="mt-6 space-y-2">
        <li>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-home w-5 text-center mr-3" />
            {sidebarOpen && 'Trang Chủ'}
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/team')}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-users w-5 text-center mr-3" />
            {sidebarOpen && 'Đội Nhóm'}
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-user w-5 text-center mr-3" />
            {sidebarOpen && 'Hồ Sơ'}
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/personal-tasks')}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-briefcase w-5 text-center mr-3" />
            {sidebarOpen && 'Công việc cá nhân'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
