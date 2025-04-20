import axiosInstance from "./urlAdmin.service";
import { getAuthHeaders } from './auth.service';

// Lấy danh sách tất cả users
export const getAllUsers = async () => {
    try {
        const result = await axiosInstance.get("/admin/users", getAuthHeaders());
        return result?.data?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Xóa user theo ID
export const deleteUser = async (userId) => {
    try {
        const result = await axiosInstance.delete(`/admin/users/${userId}`, getAuthHeaders());
        return result?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Tìm kiếm users
export const searchUsers = async (query) => {
    try {
        const result = await axiosInstance.get(`/admin/users/search?q=${query}`, getAuthHeaders());
        return result?.data?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}; 