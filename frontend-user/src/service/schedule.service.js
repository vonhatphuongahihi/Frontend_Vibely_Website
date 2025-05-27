import axiosInstance from './url.service';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';
const SCHEDULES_API = BASE_URL + '/schedules';

// Lấy tất cả lịch trình
export const getSchedule = async () => {
  try {
    const response = await axiosInstance.get(SCHEDULES_API);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi lấy lịch trình:", error.response?.data || error.message);
    throw error;
  }
};

// Thêm lịch trình mới
export const createSchedule = async (schedule) => {
  try {
    const response = await axiosInstance.post(SCHEDULES_API, schedule);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo lịch trình:", error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật lịch trình
export const updateSchedule = async (scheduleId, updatedSchedule) => {
  try {
    const response = await axiosInstance.put(`${SCHEDULES_API}/${scheduleId}`, updatedSchedule);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật lịch trình:", error.response?.data || error.message);
    throw error;
  }
};

// Xóa lịch trình
export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await axiosInstance.delete(`${SCHEDULES_API}/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa lịch trình:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy link xác thực Google Calendar
export const getGoogleCalendarAuthUrl = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/google-calendar/auth-url`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy link xác thực Google Calendar:", error.response?.data || error.message);
    throw error;
  }
};

// Kết nối với Google Calendar
export const connectGoogleCalendar = async (tokens) => {
  try {
    const response = await axiosInstance.post('/users/google-calendar/connect', tokens);
    return response.data;
  } catch (error) {
    console.error("Lỗi kết nối Google Calendar:", error.response?.data || error.message);
    throw error;
  }
};

// Ngắt kết nối Google Calendar
export const disconnectGoogleCalendar = async () => {
  try {
    const response = await axiosInstance.post('/users/google-calendar/disconnect');
    return response.data;
  } catch (error) {
    console.error("Lỗi ngắt kết nối Google Calendar:", error.response?.data || error.message);
    throw error;
  }
};

// Kiểm tra trạng thái kết nối Google Calendar
export const getGoogleCalendarStatus = async () => {
  try {
    const response = await axiosInstance.get('/users/google-calendar/status');
    return response.data;
  } catch (error) {
    console.error("Lỗi kiểm tra trạng thái Google Calendar:", error.response?.data || error.message);
    throw error;
  }
};