// src/components/HomePage.js
import React from 'react';

const HomePage = ({ toggleSidebar }) => {
  return (
    <div className="min-h-screen flex">
      
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Trang Chủ</h1>
        <p>Chào mừng bạn đến với trang chủ của ứng dụng quản lý đội nhóm.</p>
      </div>
    </div>
  );
};

export default HomePage;
