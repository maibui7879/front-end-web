const Sidebar = ({ sidebarOpen, toggleSidebar, setActivePage }) => {
  const handleHomeClick = () => {
    setActivePage('home');
  };

  const handleTeamPageClick = () => {
    setActivePage('team');
  };

  const handleProfileClick = () => {
    setActivePage('profile'); // <-- Thêm hàm xử lý này
  };
  const handlePersonalTasksClick = () => {
    setActivePage('personal-tasks');
  };
  

  return (
    <div
      className={`w-64 bg-gray-800 text-white fixed left-0 top-0 h-full transform transition-transform z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Avatar và tên người dùng */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">Xin chào</p>
            <p className="text-xs text-gray-300">User Name</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <ul className="mt-6">
        <li className="mb-4">
          <button
            onClick={handleHomeClick}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-home mr-3"></i> Trang Chủ
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={handleTeamPageClick}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-users mr-3"></i> Đội Nhóm
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={handleProfileClick}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-user mr-3"></i> Hồ Sơ
          </button>
        </li>
        <li className="mb-4">
          <button className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded">
            <i className="fa fa-cogs mr-3"></i> Cài Đặt
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={handlePersonalTasksClick}
            className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded"
          >
            <i className="fa fa-briefcase mr-3"></i> Công việc cá nhân
          </button>
        </li>

        <li className="mb-4">
          <button className="flex items-center px-4 py-2 w-full hover:bg-gray-700 rounded">
            <i className="fa fa-users-cog mr-3"></i> Công việc nhóm
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
