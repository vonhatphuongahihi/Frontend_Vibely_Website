import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động gắn token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Đăng nhập Admin
export const loginAdmin = async (adminData) => {
    try {
        const response = await axiosInstance.post('/admin/auth/login', adminData);
        if (response.data.data.token) {
            localStorage.setItem("adminToken", response.data.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Đăng xuất Admin
export const logoutAdmin = async () => {
    try {
        const response = await axiosInstance.post('/admin/auth/logout');
        localStorage.removeItem("adminToken");
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng xuất:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Kiểm tra xem Admin đã đăng nhập chưa
export const checkAdminAuth = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            return { isAuthenticated: false };
        }
        const response = await axiosInstance.get('/admin/auth/check-login');
        if (response.data.status === 'success') {
            return { isAuthenticated: true, admin: response.data.data };
        }
        return { isAuthenticated: false };
    } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error.response?.data?.message || error.message);
        return { isAuthenticated: false };
    }
};

// Cập nhật mật khẩu Admin
export const updateAdminPassword = async (passwordData) => {
    try {
        const response = await axiosInstance.put('/admin/auth/update-password', passwordData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error.response?.data?.message || error.message);
        throw error;
    }
};