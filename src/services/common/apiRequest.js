async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Thêm token nếu yêu cầu đăng nhập
        if (requiresAuth) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return { success: false, message: 'Bạn cần đăng nhập để thực hiện thao tác này.' };
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${process.env.BASE_URL}${endpoint}`, options);
        const data = await response.json();

        if (response.status < 200 || response.status >= 300) {
            return {
                success: false,
                message: data.message || data.error || 'Đã xảy ra lỗi không xác định.',
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            success: false,
            message: 'Không thể kết nối đến server.',
        };
    }
}

export default apiRequest;
