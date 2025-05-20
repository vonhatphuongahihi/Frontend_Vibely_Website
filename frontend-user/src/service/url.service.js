import axios from 'axios';

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: ApiUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// Xử lý yêu cầu
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("Yêu cầu không có token");
        }
        return config;
    },
    (error) => {
        console.error('Lỗi yêu cầu:', error);
        return Promise.reject(error);
    }
);

// Xử lý lỗi phản hồi
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('Lỗi phản hồi:', error.response.status, error.response.data);

            if (error.response.status === 401) {
                localStorage.removeItem("auth_token");
                window.location.href = '/user-login';
            }
        } else if (error.request) {
            console.error('Lỗi yêu cầu:', error.request);
        } else {
            console.error('Lỗi:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 