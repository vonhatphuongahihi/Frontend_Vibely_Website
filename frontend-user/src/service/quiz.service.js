
import axiosInstance from "./url.service";

// Tạo quiz mới
export const createQuiz = async (quizData) => {
    try {
        console.log("Quiz ID:", quizId); // 🟢 Kiểm tra giá trị quizId
        if (!quizId) throw new Error("quizId không hợp lệ");
        const result = await axiosInstance.post("/quizzes", quizData);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi tạo quiz:", error);
        throw error;
    }
};

// Lấy danh sách tất cả quiz
export const getAllQuizzes = async () => {
    try {
        const result = await axiosInstance.get("/quizzes");
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách quiz:", error);
        throw error;
    }
};

// Lấy quiz theo ID
export const getQuizById = async (quizId) => {
    try {
        const result = await axiosInstance.get(`/quizzes/${quizId}`);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy quiz theo ID:", error);
        throw error;
    }
};
// Cập nhật quiz
export const updateQuiz = async (quizId, quizData) => {
    try {
        const result = await axiosInstance.put(`/quizzes/${quizId}`, quizData);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật quiz:", error);
        throw error;
    }
};


// Xóa quiz
export const deleteQuiz = async (quizId) => {
    try {
        const result = await axiosInstance.delete(`/quizzes/${quizId}`);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi xóa quiz:", error);
        throw error;
    }
};
