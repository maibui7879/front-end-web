import React from "react"
import { Select, Spin, Avatar } from "antd"
import { useNavigate } from "react-router-dom"
import { FiSearch } from "react-icons/fi"
import useSearch from "../hooks/useSearch"
import { getInitials } from "../utils/getInitialsAvatar"

const { Option } = Select

const SearchUserBar = () => {
  const {
    searchUsers,
    loading,
    selectedUser,
    handleSearch,
    handleSelect,
  } = useSearch()
  const navigate = useNavigate()

  const handleSearchClick = () => {
    if (selectedUser) navigate(`/profile/${selectedUser}`)
  }

  const handleNameClick = (e, userId) => {
    e.stopPropagation()
    navigate(`/profile/${userId}`)
  }

  return (
    <div className="relative w-full md:w-80">
      <Select
        showSearch
        value={selectedUser}
        placeholder="Tìm người dùng..."
        onSearch={handleSearch}
        onSelect={handleSelect}
        filterOption={false}
        notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy"}
        className="w-full"
        allowClear={false}
        optionLabelProp="label"
        suffixIcon={null}
      >
        {searchUsers.map((user) => {
          const fullName = user.full_name || "Không tên"
          const initials = getInitials(fullName)

          return (
            <Option
              key={user.id}
              value={user.id}
              label={`${fullName} (${user.email})`}
            >
              <div className="flex items-center space-x-2">
                <Avatar
                  size={24}
                  src={user.avatar_url || null}
                  className="bg-gray-200 text-gray-800 text-sm font-semibold"
                >
                  {!user.avatar_url && initials}
                </Avatar>
                <div className="flex flex-col cursor-pointer">
                  <span
                    className="font-semibold hover:underline"
                    onMouseDown={(e) => handleNameClick(e, user.id)}
                  >
                    {fullName}
                  </span>
                  <span
                    className="text-xs text-gray-500 hover:underline"
                    onMouseDown={(e) => handleNameClick(e, user.id)}
                  >
                    {user.email} - {user.phone_number}
                  </span>
                </div>
              </div>
            </Option>
          )
        })}
      </Select>

      <button
        onClick={handleSearchClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
      >
        <FiSearch size={18} />
      </button>
    </div>
  )
}

export default SearchUserBar
