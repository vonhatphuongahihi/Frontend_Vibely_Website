import axiosInstance from "./urlAdmin.service";

// Hàm hỗ trợ lấy token
const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken"); // dùng đúng key
    return {
        headers: { 'Authorization': `Bearer ${token}` },
    };
};

// Lấy thông tin Admin
export const getAdminById = async (adminId) => {
    try {
        const result = await axiosInstance.get(`/admin/account/${adminId}`, getAuthHeaders());
        return result?.data;
    } catch (error) {
    console.error("Lỗi khi lấy thông tin admin:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
    });
        throw error;
    }
};


// Cập nhật thông tin admin
export const updateAdminInfo = async (adminId, adminData) => {
    try {
        const result = await axiosInstance.put(`/admin/account/${adminId}`, adminData, getAuthHeaders());
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin admin:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Upload ảnh đại diện
export const uploadProfilePicture = async (adminId, file) => { // Thêm adminId vào tham số
    try {
        const formData = new FormData();
        formData.append("profilePicture", file);

        const result = await axiosInstance.post(`/admin/account/avatar/${adminId}`, formData, {
            headers: {
                ...getAuthHeaders().headers,
                "Content-Type": "multipart/form-data",
            },
        });

        return result?.data;
    } catch (error) {
        console.error("Lỗi khi tải ảnh lên:", error.response ? error.response.data : error.message);
        throw error;
    }
};
