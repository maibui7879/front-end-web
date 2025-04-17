import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HomePage from './components/HomePage';
import TeamPage from './components/TeamPage';
import Profile from './components/Profile'; 
import PersonalTasksPage from './components/PersonalTasksPage';


const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('home'); // Trạng thái trang hiện tại

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <Topbar />

      <div className="flex relative flex-1">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} setActivePage={setActivePage} />

        {/* Nút toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-64 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg transition-all duration-300"
          style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-15rem)' }}
        >
          <i className={`fa ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
        </button>

        {/* Nội dung chính */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} p-6`}>
          {activePage === 'home' && <HomePage />}
          {activePage === 'team' && <TeamPage />} {/* Hiển thị TeamPage khi activePage là 'team' */}
          {activePage === 'profile' && <Profile />}
          {activePage === 'personal-tasks' && <PersonalTasksPage />}
        </div>
      </div>
    </div>
  );
};

export default App;
