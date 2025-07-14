import axios from 'axios';
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

// 🔁 Global error handler
api.interceptors.response.use(
    (res) => res,
    (error) => {
        console.log("🚨 API Error:", error?.response || error.message);

        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            toast.error("Session expired. Please log in again.", {
                toastId: "session-expired",
            });
        }

        return Promise.reject(error);
    }
);

export default api;