import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Lỗi khi lấy hồ sơ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate('/create-profile');
  };

  if (loading) return <div className="p-6 text-center">Đang tải hồ sơ...</div>;
  if (!user) return <div className="p-6 text-red-500">Không thể tải hồ sơ người dùng.</div>;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Cột avatar + thông tin chính */}
          <div className="md:w-1/3 bg-gray-700 text-white flex flex-col items-center justify-center p-8 space-y-4 border-r-2 border-dashed border-white">
            <img
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              src={user.avatar_url || 'https://i.pravatar.cc/100'}
              alt="Avatar"
            />
            <h2 className="text-2xl font-bold">{user.full_name}</h2>
            <p className="text-sm text-gray-100">{user.email}</p>
            <button
              onClick={handleEdit}
              className="bg-white text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition"
            >
              Chỉnh sửa hồ sơ
            </button>
          </div>

          {/* Cột thông tin chi tiết */}
          <div className="md:w-2/3 p-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Thông tin chi tiết</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Số điện thoại</label>
                <div className="p-3 border rounded-md bg-gray-50">{user.phone_number || 'Chưa cập nhật'}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Giới tính</label>
                <div className="p-3 border rounded-md bg-gray-50 capitalize">{user.gender || 'Chưa cập nhật'}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Ngày sinh</label>
                <div className="p-3 border rounded-md bg-gray-50">
                  {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Địa chỉ</label>
                <div className="p-3 border rounded-md bg-gray-50">{user.address || 'Chưa cập nhật'}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Giới thiệu</label>
              <div className="p-3 border rounded-md bg-gray-50 whitespace-pre-line">
                {user.bio || 'Chưa có thông tin giới thiệu.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Profile;
