import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(false);
  const [showTeams, setShowTeams] = useState(false);

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

  const toggleTeams = (e) => {
    e.stopPropagation();
    setShowTeams(prev => !prev);
  };

  const goToTeamsPage = () => {
    navigate('/team');
  };

  return (
    <div className="w-20 md:w-64 text-sm text-gray-700 bg-white/60 border-r border-gray-300 fixed top-0 left-0 h-full transition-all duration-300 z-50 backdrop-blur-lg shadow-md rounded-tr-2xl">
      {user && (
        <div className="flex flex-col items-center md:flex-row md:items-center gap-2 px-4 py-4">
          <img
            src={user.avatar_url || 'https://i.pravatar.cc/100'}
            alt="Avatar"
            className="h-8 w-8 rounded-full object-cover border-2 border-white shadow"
          />
          <span className="hidden md:inline text-sm font-semibold">{user.full_name}</span>
        </div>
      )}

      <div className="border-t border-gray-300 mx-4" />

      <ul className="mt-4 space-y-1 px-3">
        <p className="px-4 py-2 text-gray-500 text-xs uppercase tracking-wide">Chung</p>
        <SidebarItem icon="fa-home" label="Trang Chủ" to="/home" />
      </ul>

      <ul className="mt-4 space-y-1 px-3">
        <p className="px-4 py-2 text-gray-500 text-xs uppercase tracking-wide">Đội nhóm</p>
        <li>
          <div
            onClick={goToTeamsPage}
            className="flex items-center px-4 py-2 w-full rounded cursor-pointer hover:bg-gray-100 font-medium"
          >
            <i className="fa fa-users w-5 text-center mr-3" />
            <span className="hidden md:inline">Tất cả nhóm</span>
            <button
              onClick={toggleTeams}
              className="ml-auto text-gray-600 hover:text-blue-700"
            >
              <i
                className={`fa text-xs ${showTeams ? 'fa-chevron-up' : 'fa-chevron-down'}`}
              />
            </button>
          </div>
        </li>

        {showTeams && (
          <>
            {teamLoading && (
              <li className="text-gray-500 ml-4 text-xs">Đang tải nhóm...</li>
            )}
            {!teamLoading && teamError && (
              <li className="text-red-500 ml-4 text-xs">Không có nhóm</li>
            )}
            {!teamLoading && !teamError && teams.length === 0 && (
              <li className="text-gray-500 ml-4 text-xs">Chưa có nhóm nào</li>
            )}
            {!teamLoading && !teamError && teams.length > 0 &&
              teams.slice(0, 5).map(team => (
                <li
                  key={team.id}
                  className="ml-6 md:ml-8 flex items-center cursor-pointer hover:text-blue-700 transition text-sm"
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  <img
                    src={team.avatar_url || 'https://i.pravatar.cc/40?u=' + team.id}
                    alt={`${team.name} avatar`}
                    className="h-5 w-5 rounded-full object-cover mr-2 border border-gray-300"
                  />
                  {team.name}
                </li>
              ))}
          </>
        )}
      </ul>

      <ul className="mt-4 space-y-1 px-3">
        <p className="px-4 py-2 text-gray-500 text-xs uppercase tracking-wide">Tài khoản</p>
        <SidebarItem icon="fa-user" label="Hồ Sơ" to="/profile" />
        <SidebarItem icon="fa-briefcase" label="Công việc cá nhân" to="/personal-tasks" />
      </ul>

      <div className="border-t border-gray-300 my-6 mx-4" />

      <div className="absolute bottom-5 w-full px-3">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 w-full rounded text-red-500 hover:text-red-600 font-medium"
        >
          <i className="fa fa-sign-out w-5 text-center mr-3" />
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
        className="flex items-center px-4 py-2 w-full rounded hover:text-blue-700 transition text-sm font-medium"
      >
        <i className={`fa ${icon} w-5 text-center mr-3`} />
        <span className="hidden md:inline">{label}</span>
      </button>
    </li>
  );
};

export default Sidebar;
