import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = (import.meta.env.MODE === "development") ? import.meta.env.VITE_API_BASE_URL : "/api";


const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("Session expired. Please login again.");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;