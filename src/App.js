import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HomePage from './components/HomePage';
import TeamPage from './components/TeamPage';
import Profile from './components/Profile';
import PersonalTasksPage from './components/PersonalTasksPage';
import AuthPage from './components/AuthPage';
import CreateProfilePage from './components/CreateProfilePage';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Topbar */}
        <Topbar />

        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Nội dung chính */}
          <div
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-16'
            }`}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/personal-tasks" element={<PersonalTasksPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/create-profile" element={<CreateProfilePage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
