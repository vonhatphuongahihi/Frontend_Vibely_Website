import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: ApiUrl,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
})

export default axiosInstance;