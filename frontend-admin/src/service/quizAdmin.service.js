import axiosInstance from './urlAdmin.service';

// Get all quizzes
export const getQuizzes = async () => {
    try {
        const response = await axiosInstance.get('/admin/quiz');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get quiz by ID
export const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(`/admin/quiz/${quizId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create new quiz
export const createQuiz = async (quizData) => {
    try {
        const response = await axiosInstance.post('/admin/quiz', quizData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update quiz
export const updateQuiz = async (quizId, quizData) => {
    try {
        console.log('Updating quiz with data:', quizData); // Debug log
        const response = await axiosInstance.put(`/admin/quiz/${quizId}`, quizData);
        console.log('Update response from server:', response); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error in updateQuiz:', error.response || error); // Debug log
        throw error;
    }
};

// Delete quiz
export const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(`/admin/quiz/${quizId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 