import React, { useState, useEffect } from 'react';

const Profile = () => {
  // Load từ localStorage (nếu có) hoặc dùng giá trị mặc định
  const storedUser = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'Thành viên',
    avatar: 'https://i.pravatar.cc/100',
  };

  const [user, setUser] = useState(storedUser);
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...storedUser });

  useEffect(() => {
    // Cập nhật localStorage mỗi khi user thay đổi
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setTempUser({ ...user });
    setEditMode(false);
  };

  const handleSave = () => {
    setUser({ ...tempUser });
    setEditMode(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row items-center p-6 space-y-4 md:space-y-0 md:space-x-6">
          <img
            className="h-24 w-24 rounded-full object-cover"
            src={user.avatar}
            alt="Avatar"
          />
          <div className="w-full space-y-4">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ tên</label>
              <input
                type="text"
                name="name"
                value={tempUser.name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 disabled:bg-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={tempUser.email}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 disabled:bg-gray-100"
              />
            </div>

            {/* Vai trò */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <select
                name="role"
                value={tempUser.role}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 disabled:bg-gray-100"
              >
                <option>Thành viên</option>
                <option>Quản trị viên</option>
              </select>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end space-x-2 pt-2">
              {!editMode ? (
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
