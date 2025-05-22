import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/auth', { replace: true });
        }
    }, [token, navigate]);

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
