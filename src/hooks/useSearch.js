import { useState, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

const useSearch = () => {
  const [searchUsers, setSearchUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const { token } = useContext(AuthContext)

  const handleSearch = async (value) => {
    setSearchValue(value)
    if (!value.trim()) {
      setSearchUsers([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/search?searchTerm=${encodeURIComponent(value)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error("Search failed")
      const data = await res.json()
      setSearchUsers(data.users || [])
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (value) => {
    setSelectedUser(value)
  }

  return {
    searchUsers,
    loading,
    selectedUser,
    searchValue,
    handleSearch,
    handleSelect,
    setSelectedUser,
  }
}

export default useSearch
