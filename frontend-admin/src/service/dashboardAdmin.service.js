import axiosInstance from "./urlAdmin.service";

// Hàm hỗ trợ lấy token
const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
};

// Lấy tất cả dữ liệu dashboard trong một request
export const getAllDashboardData = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard", getAuthHeaders());
        if (result?.data?.data) {
            return {
                totalUsers: result.data.data.totalUsers || 0,
                totalPosts: result.data.data.totalPosts || 0,
                totalDocuments: result.data.data.totalDocuments || 0,
                totalInquiries: result.data.data.totalInquiries || 0,
                usersData: result.data.data.usersData || [],
                postsData: result.data.data.postsData || [],
                documentsData: result.data.data.documentsData || [],
                inquiriesData: result.data.data.inquiriesData || []
            };
        }
        throw new Error('Không nhận được dữ liệu từ server');
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
        return {
            totalUsers: 0,
            totalPosts: 0,
            totalDocuments: 0,
            totalInquiries: 0,
            usersData: [],
            postsData: [],
            documentsData: [],
            inquiriesData: []
        };
    }
};

// Lấy tổng số lượng người dùng
export const getTotalUsers = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-users", getAuthHeaders());
        return result?.data?.data || 0;
    } catch (error) {
        console.error("Lỗi khi lấy tổng số người dùng:", error);
        return 0;
    }
};

// Lấy tổng số lượng bài viết
export const getTotalPosts = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-posts", getAuthHeaders());
        return result?.data?.data || 0;
    } catch (error) {
        console.error("Lỗi khi lấy tổng số bài viết:", error);
        return 0;
    }
};

// Lấy tổng số lượng tài liệu
export const getTotalDocuments = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-documents", getAuthHeaders());
        return result?.data?.data || 0;
    } catch (error) {
        console.error("Lỗi khi lấy tổng số tài liệu:", error);
        return 0;
    }
};

// Lấy tổng số lượng câu hỏi
export const getTotalQuestions = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-inquiries", getAuthHeaders());
        return result?.data?.data || 0;
    } catch (error) {
        console.error("Lỗi khi lấy tổng số câu hỏi:", error);
        return 0;
    }
};

// Lấy dữ liệu thống kê theo năm, tháng hoặc ngày
export const getDashboardStats = async (timeUnit = "day") => {
    try {
        // Gửi tham số timeUnit vào URL
        const result = await axiosInstance.get(`/admin/dashboard/stats?timeUnit=${timeUnit}`, getAuthHeaders());
        if (result?.data?.data) {
            return {
                postsStats: result.data.data.postsStats || [],
                usersStats: result.data.data.usersStats || [],
                inquiriesStats: result.data.data.inquiriesStats || [],
                documentsStats: result.data.data.documentsStats || []
            };
        }
        throw new Error('Không nhận được dữ liệu thống kê từ server');
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        return { postsStats: [], usersStats: [], inquiriesStats: [], documentsStats: [] };
    }
};
