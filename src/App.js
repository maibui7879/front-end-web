import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './layouts/Sidebar/Sidebar';
import Topbar from './layouts/components/Header/Topbar';
import { publicRoutes, privateRoutes } from './routes';
import CreateProfilePage from './pages/UserCRUD/CreateProfilePage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

const AppLayout = ({ children, sidebarOpen, toggleSidebar }) => (
    <div
        className="min-h-screen flex"
        style={{
            backgroundImage: "url('/bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ml-20 md:ml-64 px-4 py-2`}>
            <div
                className="rounded-2xl shadow p-4 min-h-screen"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
            >
                <Topbar />
                <div className="mt-4">{children}</div>
            </div>
        </div>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

const Main = ({ sidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const isFullPage = ['/'].includes(location.pathname);

    useEffect(() => {
        if (!token && location.pathname !== '/') {
            navigate('/', { replace: true });
        }
    }, [token, location.pathname, navigate]);

    return (
        <>
            {isFullPage ? (
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        return <Route key={index} path={route.path} element={<Page />} />;
                    })}
                </Routes>
            ) : (
                <AppLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
                    <Routes>
                        {privateRoutes.map((route, index) => {
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <ProtectedRoute>
                                            <Page />
                                        </ProtectedRoute>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </AppLayout>
            )}
        </>
    );
};

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
                setSidebarOpen(false);
            } else {
                setIsMobile(false);
                setSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        if (!isMobile) {
            setSidebarOpen(!sidebarOpen);
        }
    };

    return (
        <AuthProvider>
            <Router>
                <Main sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </Router>
        </AuthProvider>
    );
};

export default App;
