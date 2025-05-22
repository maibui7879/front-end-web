import React, { useState, useContext } from "react";
import { Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const { Option } = Select;

const SearchUserBar = () => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setSearchUsers([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/search?searchTerm=${encodeURIComponent(value)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setSearchUsers(data.users || []);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (userId) => {
    if (userId) navigate(`/profile/${userId}`);
  };

  return (
    <Select
      showSearch
      placeholder="Tìm người dùng..."
      onSearch={handleSearch}
      onSelect={handleSelect}
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy"}
      className="w-64 md:w-80"
      allowClear
    >
      {searchUsers.map((user) => (
        <Option key={user.id} value={user.id}>
          {user.full_name} ({user.email}) - {user.phone_number}
        </Option>
      ))}
    </Select>
  );
};

export default SearchUserBar;
