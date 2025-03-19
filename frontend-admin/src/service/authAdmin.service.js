import axiosInstance from "./urlAdmin.service";

// ✅ Đăng nhập Admin
export const loginAdmin = async (adminData) => {
    try {
        const response = await axiosInstance.post('/admin/auth/login', adminData, { withCredentials: true });

        const token = response.data?.data?.token;
        if (token) {
            localStorage.setItem("adminToken", token); // Lưu token nếu có
        }

        return response.data;
    } catch (error) {
        console.error("🚨 Lỗi đăng nhập:", error.response?.data?.message || error.message);
        throw error;
    }
};

// ✅ Đăng xuất Admin (Sửa từ GET -> POST)
export const logoutAdmin = async () => {
    try {
        const response = await axiosInstance.post('/admin/auth/logout', {}, { withCredentials: true });

        localStorage.removeItem("adminToken"); // Xóa token khỏi localStorage
        return response.data;
    } catch (error) {
        console.error("🚨 Lỗi đăng xuất:", error.response?.data?.message || error.message);
        throw error;
    }
};

// ✅ Kiểm tra xem Admin đã đăng nhập chưa
export const checkAdminAuth = async () => {
    try {
        const response = await axiosInstance.get('/admin/auth/check-auth', { withCredentials: true });

        return response.data?.status === 'success'
            ? { isAuthenticated: true, admin: response.data?.data }
            : { isAuthenticated: false };
    } catch (error) {
        console.error("🚨 Lỗi kiểm tra đăng nhập:", error.response?.data?.message || error.message);
        return { isAuthenticated: false };
    }
};
