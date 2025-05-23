import React, { useEffect, useState, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import SearchUserBar from "./SearchUserBar"
import { Avatar } from "antd"
import { FaUser, FaUsers, FaTasks, FaSignOutAlt } from 'react-icons/fa'
import { getInitials } from "../utils/getInitialsAvatar"

const Topbar = () => {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()
  const navigate = useNavigate()
  const { token, logout } = useContext(AuthContext)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Không thể tải hồ sơ")
        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error("Lỗi khi tải thông tin topbar:", error)
      }
    }
    fetchProfile()
  }, [token])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNavigate = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate("/auth")
  }

  return (
    <div className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-400 z-[100] bg-white gap-2 flex-nowrap">
      <div className="flex items-center gap-2 shrink-0">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <span className="hidden md:inline text-lg font-bold whitespace-nowrap">TeamManager</span>
      </div>

      <div className="flex-grow max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
        <SearchUserBar />
      </div>

      {user && (
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <span className="hidden md:inline text-sm truncate max-w-[120px]">{user.full_name}</span>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <Avatar size={40} className="bg-[#888] text-white font-bold">
                {getInitials(user.full_name)}
              </Avatar>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-md py-2 z-[9999]">
              <button
                onClick={() => handleNavigate("/profile")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <FaUser className="w-4 h-4 mr-2" />
                Hồ sơ
              </button>
              <button
                onClick={() => handleNavigate("/team")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <FaUsers className="w-4 h-4 mr-2" />
                Đội nhóm
              </button>
              <button
                onClick={() => handleNavigate("/personal-tasks")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <FaTasks className="w-4 h-4 mr-2" />
                Công việc cá nhân
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default Topbar
