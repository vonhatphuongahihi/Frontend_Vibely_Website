import axiosInstance from './url.service';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/schedules' || 'http://localhost:8081/schedules';

// Lấy tất cả lịch trình
export const getSchedule = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi lấy lịch trình:", error.response?.data || error.message);
    throw error;
  }
};

// Thêm lịch trình mới
export const createSchedule = async (schedule) => {
  try {
    const response = await axiosInstance.post(API_URL, schedule);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo lịch trình:", error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật lịch trình
export const updateSchedule = async (scheduleId, updatedSchedule) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${scheduleId}`, updatedSchedule);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật lịch trình:", error.response?.data || error.message);
    throw error;
  }
};

// Xóa lịch trình
export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa lịch trình:", error.response?.data || error.message);
    throw error;
  }
};