import React from 'react';

const Topbar = () => {
  return (
    <div className="w-full bg-gray-600 shadow p-4 flex justify-end items-center">
      {/* Logo và nội dung khác căn phải */}
      <div className="flex items-center gap-2">
        <img
          src="/logo.png" // Đặt ảnh logo trong public/logo.png hoặc thay đổi đường dẫn tùy ý
          alt="Logo"
          className="h-10"
        />
        <span className="text-xl font-bold text-white">TeamManager</span>
      </div>
    </div>
  );
};

export default Topbar;
