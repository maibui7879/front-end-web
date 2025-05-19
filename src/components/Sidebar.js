import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(false);
  const [showTeams, setShowTeams] = useState(false); // toggle hiển thị team

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProfile = async () => {
      try {
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

    const fetchTeams = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/teams', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!data.items || data.items.length === 0) {
          setTeamError(true);
          setTeams([]);
        } else {
          setTeams(data.items);
          setTeamError(false);
        }
      } catch (err) {
        setTeamError(true);
        setTeams([]);
      } finally {
        setTeamLoading(false);
      }
    };

    fetchProfile();
    fetchTeams();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  // Hàm toggle hiển thị team
  const toggleTeams = () => {
    setShowTeams(prev => !prev);
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

        {/* Đội Nhóm với nút toggle */}
        <li>
          <button
            onClick={toggleTeams}
            className="flex items-center px-4 py-3 w-full rounded hover:text-blue-700 transition text-lg font-medium"
          >
            <i className={`fa fa-users w-6 text-[18px] text-center mr-4`} />
            <span className="hidden md:inline">Đội Nhóm</span>
            <i
              className={`fa ml-auto mr-1 transition-transform duration-200 ${
                showTeams ? 'fa-chevron-up' : 'fa-chevron-down'
              }`}
              aria-hidden="true"
            />
          </button>
        </li>

        {/* Hiển thị team nếu toggle = true */}
        {showTeams && (
          <>
            {teamLoading && (
              <li className="text-sm text-gray-500 ml-2 md:ml-4">Đang tải nhóm...</li>
            )}
            {!teamLoading && teamError && (
              <li className="text-sm text-red-500 ml-2 md:ml-4">Không thể tải nhóm</li>
            )}
            {!teamLoading && !teamError && teams.length === 0 && (
              <li className="text-sm text-gray-500 ml-2 md:ml-4">Chưa có nhóm nào</li>
            )}
            {!teamLoading && !teamError && teams.length > 0 &&
              teams.slice(0, 5).map(team => (
                <li
                  key={team.id}
                  className="ml-6 md:ml-8 flex items-center cursor-pointer hover:text-blue-700 transition text-sm font-medium"
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  <img
                    src={team.avatar_url || 'https://i.pravatar.cc/40?u=' + team.id}
                    alt={`${team.name} avatar`}
                    className="h-6 w-6 rounded-full object-cover mr-2 border border-gray-300"
                  />
                  {team.name}
                </li>
              ))}
          </>
        )}

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
