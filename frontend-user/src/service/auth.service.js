import axiosInstance from "./url.service";

// Đăng ký người dùng
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server trả về lỗi
            throw new Error(error.response.data.message || 'Đăng ký thất bại');
        } else if (error.request) {
            // Không nhận được response từ server
            throw new Error('Không thể kết nối đến server');
        } else {
            // Lỗi khi thiết lập request
            throw new Error('Có lỗi xảy ra khi đăng ký');
        }
    }
}
// Đăng nhập người dùng
export const loginUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/login', userData, { withCredentials: true });

        if (response.data.data.token) {
            localStorage.setItem("token", response.data.data.token);
        }

        return response.data
    } catch (error) {
        console.log(error)
    }
}

// Đăng xuất người dùng
export const logout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        localStorage.removeItem("token");

        // Ngắt kết nối socket nếu có
        const socket = window.socket;
        if (socket) {
            socket.disconnect();
            window.socket = null;
        }

        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteAccount = async () => {
    try {
        const response = await axiosInstance.delete('/auth/deleteAccount');
        localStorage.removeItem("token");
        return response.data
    } catch (error) {
        console.log(error)
    }
}

// Kiểm tra xem người dùng đã đăng nhập chưa
export const checkUserAuth = async () => {
    try {
        const response = await axiosInstance.get('/users/check-auth');
        if (response.data.status === 'success') {
            return { isAuthenticated: true, user: response?.data?.data }
        } else if (response.data.status === 'error') {
            return { isAuthenticated: false }
        }
    } catch (error) {
        console.log(error)
        return { isAuthenticated: false }
    }
}