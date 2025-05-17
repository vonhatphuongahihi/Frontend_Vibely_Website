import { toast } from 'react-hot-toast';
import axiosInstance from "./url.service";

// Đăng ký người dùng
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        if (response.data.status === 'success' && response.data.data.token) {
            localStorage.setItem("auth_token", response.data.data.token);
            toast.success("Đăng ký thành công");
        }
        return response.data;
    } catch (error) {
        console.error("Đăng ký thất bại:", error.response?.data || error.message);
        throw error;
    }
}

// Đăng nhập người dùng
export const loginUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/login', userData);
        if (response.data.status === 'success' && response.data.data.token) {
            localStorage.setItem("auth_token", response.data.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Đăng nhập thất bại:", error.response?.data || error.message);
        throw error;
    }
}

// Đăng xuất người dùng
export const logout = async () => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập");
            return;
        }
        const response = await axiosInstance.post('/auth/logout');
        localStorage.removeItem("auth_token");
        return response.data;
    } catch (error) {
        console.error("Đăng xuất thất bại:", error.response?.data || error.message);
        localStorage.removeItem("auth_token"); // Xóa token ngay cả khi có lỗi
        throw error;
    }
}

// Kiểm tra xem người dùng đã đăng nhập chưa
export const checkUserAuth = async () => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            return { isAuthenticated: false };
        }

        const response = await axiosInstance.get('/users/check-auth');
        if (response.data.status === 'success') {
            return { isAuthenticated: true, user: response.data.data };
        } else {
            console.warn("Kiểm tra xác thực thất bại:", response.data.message);
            localStorage.removeItem("auth_token");
            return { isAuthenticated: false };
        }
    } catch (error) {
        console.error("Kiểm tra xác thực thất bại:", error.response?.data || error.message);
        localStorage.removeItem("auth_token");
        return { isAuthenticated: false };
    }
}

// Xóa tài khoản người dùng
export const deleteAccount = async () => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập");
            return;
        }
        const response = await axiosInstance.delete('/auth/deleteAccount', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        localStorage.removeItem("auth_token");
        return response.data;
    } catch (error) {
        console.error("Xóa tài khoản thất bại:", error.response?.data || error.message);
        throw error;
    }
}

// Xử lý callback từ social login
export const handleSocialCallback = async (token, userId, email, username) => {
    try {
        if (token) {
            localStorage.setItem("auth_token", token);
            return {
                status: 'success',
                data: {
                    userId,
                    email,
                    username,
                    token
                }
            };
        }
        throw new Error('Token không hợp lệ');
    } catch (error) {
        console.error("Xử lý social callback thất bại:", error);
        throw error;
    }
}

// Các hàm lấy URL đăng nhập
export const getGoogleLoginUrl = () => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
}

export const getFacebookLoginUrl = () => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook`;
}

export const getGithubLoginUrl = () => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`;
}