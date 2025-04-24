import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HomePage from './components/HomePage';
import TeamPage from './components/TeamPage';
import Profile from './components/Profile';
import PersonalTasksPage from './components/PersonalTasksPage';
import AuthPage from './components/AuthPage';
import CreateProfilePage from './components/CreateProfilePage';

const AppLayout = ({ children, sidebarOpen, toggleSidebar }) => (
  <div className="min-h-screen flex bg-gray-100">
    <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    <div
      className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-16'
      } px-4 py-2`}
    >
      <div className="bg-white rounded-2xl shadow p-4 min-h-screen">
        <Topbar />
        <div className="mt-4">{children}</div>
      </div>
    </div>
  </div>
);

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

const Main = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const isFullPage = ['/auth',].includes(
    location.pathname
  );

  return (
    <>
      {isFullPage ? (
        // Layout không có Topbar/Sidebar
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
        </Routes>
      ) : (
        // Layout có Topbar/Sidebar
        <AppLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <TeamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personal-tasks"
              element={
                <ProtectedRoute>
                  <PersonalTasksPage />
                </ProtectedRoute>
              }
            />
            <Route path="/create-profile" element={<CreateProfilePage />} />
          </Routes>
        </AppLayout>
      )}
    </>
  );
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Hàm kiểm tra kích thước màn hình và cập nhật trạng thái mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setSidebarOpen(false); // Đặt sidebar đóng khi là mobile
      } else {
        setIsMobile(false);
        setSidebarOpen(true); // Đặt sidebar mở khi không phải mobile
      }
    };

    // Kiểm tra khi lần đầu render và mỗi khi thay đổi kích thước màn hình
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Cleanup listener khi component unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <Router>
      <Main sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Router>
  );
};

export default App;
