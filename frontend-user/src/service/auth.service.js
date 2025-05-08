import axiosInstance from "./url.service";

// Đăng ký người dùng
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);

        if (response.data.status === 'success' && response.data.data.token) {
            localStorage.setItem("auth_token", response.data.data.token);
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
        const response = await axiosInstance.post('/auth/logout');
        localStorage.removeItem("auth_token");
        return response.data;
    } catch (error) {
        console.error("Đăng xuất thất bại:", error.response?.data || error.message);
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
            return { isAuthenticated: false };
        }
    } catch (error) {
        console.error("Kiểm tra xác thực thất bại:", error.response?.data || error.message);
        return { isAuthenticated: false };
    }
}

// Xóa tài khoản người dùng
export const deleteAccount = async () => {
    try {
        const response = await axiosInstance.delete('/auth/deleteAccount');
        localStorage.removeItem("auth_token");
        return response.data;
    } catch (error) {
        console.error("Xóa tài khoản thất bại:", error.response?.data || error.message);
        throw error;
    }
}