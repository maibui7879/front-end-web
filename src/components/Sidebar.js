import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);  // Thêm state để kiểm tra kích thước màn hình

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);  // Giả sử màn hình nhỏ hơn 768px là mobile
    };

    // Kiểm tra kích thước khi load component
    checkMobile();

    // Lắng nghe sự thay đổi kích thước cửa sổ
    window.addEventListener('resize', checkMobile);

    // Dọn dẹp khi component unmount
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

        if (!response.ok) throw new Error('Không thể lấy thông tin người dùng');

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div
      className={`${
        !isMobile && sidebarOpen ? 'w-64' : 'w-20'  
      } bg-[#F8F5FC] text-gray-800 border-r border-[#E5E7EB] fixed left-0 mr-2 top-0 h-full rounded-tr-xl transition-all duration-300 z-50 shadow-sm`}
    >

      <div className="flex justify-center p-4 border-b border-[#E5E7EB]">
        <button
          onClick={toggleSidebar}
          className="text-purple-500 hover:text-purple-700 transition"
          title="Thu gọn"
        >
          <i className={`fa ${(!isMobile && sidebarOpen) ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
        </button>
      </div>


      <ul className="mt-6 space-y-2 px-3">
        <SidebarItem
          icon="fa-home"
          label="Trang Chủ"
          to="/home"
          sidebarOpen={sidebarOpen && !isMobile}
          navigate={navigate}
          isMobile={isMobile} 
        />
        <SidebarItem
          icon="fa-users"
          label="Đội Nhóm"
          to="/team"
          sidebarOpen={sidebarOpen && !isMobile}
          navigate={navigate}
          isMobile={isMobile}  
        />
        <SidebarItem
          icon="fa-user"
          label="Hồ Sơ"
          to="/profile"
          sidebarOpen={sidebarOpen && !isMobile}
          navigate={navigate}
          isMobile={isMobile}  
        />
        <SidebarItem
          icon="fa-briefcase"
          label="Công việc cá nhân"
          to="/personal-tasks"
          sidebarOpen={sidebarOpen && !isMobile}
          navigate={navigate}
          isMobile={isMobile}  
        />
      </ul>

      {/* Divider */}
      <div className="border-t border-[#E5E7EB] my-6 mx-4" />

      {/* Logout */}
      <div className="absolute bottom-5 w-full px-3">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 w-full text-left rounded hover:bg-red-50 text-red-500 hover:text-red-600 transition  font-medium"
        >
          <i className="fa fa-sign-out w-6 text-[18px] text-center mr-4" />
          {(!isMobile && sidebarOpen) && 'Đăng xuất'} 
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, to, sidebarOpen, navigate, isMobile }) => (
  <li>
    <button
      onClick={() => navigate(to)}
      className="flex items-center px-4 py-3 w-full rounded hover:bg-[#E3D7FB] hover:text-[#7C3AED] transition text-lg font-medium"
    >
      <i className={`fa ${icon} w-6 text-[18px] text-center mr-4`} />
      {(sidebarOpen && !isMobile) && <span>{label}</span>} 
    </button>
  </li>
);

export default Sidebar;
