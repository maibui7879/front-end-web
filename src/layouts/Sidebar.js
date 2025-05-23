import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import useUserProfile from "../hooks/useUserProfile"
import useTeamList from "../hooks/useTeamList"
import { getInitials } from "../utils/getInitialsAvatar"

const AvatarInitials = ({ name }) => (
  <div
    className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold select-none border-2 border-white shadow"
    title={name}
  >
    {getInitials(name)}
  </div>
)

const SidebarItem = ({ icon, label, to }) => {
  const navigate = useNavigate()
  return (
    <li>
      <button
        onClick={() => navigate(to)}
        className="flex items-center px-4 py-2 w-full rounded hover:bg-blue-100 hover:text-blue-700 transition text-sm font-medium"
      >
        <i className={`fa ${icon} w-5 text-center mr-3`} />
        <span className="hidden md:inline">{label}</span>
      </button>
    </li>
  )
}

const Sidebar = ({ sidebarOpen }) => {
  const navigate = useNavigate()
  const { user, loading: userLoading } = useUserProfile()
  const { teams, loading: teamLoading } = useTeamList()
  const [showTeams, setShowTeams] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    sessionStorage.clear()
    navigate("/")
    window.location.reload()
  }

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } fixed top-0 left-0 h-full bg-white/60 border-r border-gray-300 backdrop-blur-lg shadow-md rounded-tr-2xl text-gray-700 text-sm z-50 transition-all duration-300 overflow-y-auto`}
    >
      {userLoading ? (
        <div className="flex items-center justify-center p-4">Đang tải hồ sơ...</div>
      ) : (
        user && (
          <div className="flex items-center gap-2 px-4 py-4 md:flex-row md:items-center flex-col">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <AvatarInitials name={user.full_name} />
            )}
            {sidebarOpen && (
              <span className="hidden md:inline font-semibold">{user.full_name}</span>
            )}
          </div>
        )
      )}

      <hr className="mx-4 border-gray-300" />

      <ul className="mt-4 space-y-1 px-3">
        {sidebarOpen && (
          <p className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500">Chung</p>
        )}
        <SidebarItem icon="fa-home" label="Trang Chủ" to="/home" />
        <SidebarItem icon="fa-briefcase" label="Công việc cá nhân" to="/personal-tasks" />
        <SidebarItem icon="fa-calendar" label="Lịch cá nhân" to="/calendar" />
      </ul>

      <ul className="mt-4 space-y-1 px-3">
        {sidebarOpen && (
          <p className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500">Đội nhóm</p>
        )}
        <SidebarItem icon="fa-layer-group" label="Đội nhóm" to="/team" />

        {sidebarOpen && (
          <li>
            <div
              onClick={() => setShowTeams(!showTeams)}
              className="flex items-center justify-between px-4 py-2 w-full rounded cursor-pointer hover:bg-gray-100 bg-gray-50 font-medium select-none"
            >
              <div className="flex items-center">
                <i className="fa fa-users w-5 text-center mr-3" />
                <span>Tất cả nhóm</span>
              </div>
              <i className={`fa transition-transform duration-200 ${showTeams ? "fa-chevron-up" : "fa-chevron-down"}`} />
            </div>
          </li>
        )}

        {showTeams && sidebarOpen && (
          <ul>
            {teamLoading && (
              <li className="ml-4 text-xs text-gray-500">Đang tải nhóm...</li>
            )}
            {!teamLoading && teams.length === 0 && (
              <li className="ml-4 text-xs text-gray-500">Chưa có nhóm nào</li>
            )}
            {!teamLoading &&
              teams.slice(0, 5).map(team => (
                <li
                  key={team.id}
                  className="ml-4 flex items-center cursor-pointer hover:text-blue-700 transition text-sm"
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  {team.avatar_url ? (
                    <img
                      src={team.avatar_url}
                      alt={`${team.name} avatar`}
                      className="h-5 w-5 rounded-full object-cover mr-2 border border-gray-300"
                    />
                  ) : (
                    <AvatarInitials name={team.name} />
                  )}
                  {team.name}
                </li>
              ))}
          </ul>
        )}
      </ul>

      <ul className="mt-4 space-y-1 px-3">
        {sidebarOpen && (
          <p className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500">Tài khoản</p>
        )}
        <SidebarItem icon="fa-user" label="Hồ Sơ" to="/profile" />
      </ul>

      <hr className="mx-4 my-6 border-gray-300" />

      <div className="absolute bottom-5 w-full px-3">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 w-full rounded text-red-500 hover:text-red-600 font-medium"
        >
          <i className="fa fa-sign-out w-5 text-center mr-3" />
          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
