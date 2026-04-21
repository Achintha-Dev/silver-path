import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// automatically add the access token to the headers of each protected request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration in globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const isLoginRoute = error.config?.url?.includes('/auth/login');
        const isVerifyRoute = error.config?.url?.includes('/auth/verify-access');
        const hasToken = !!localStorage.getItem('adminToken');
        
        if (status === 401 && !isLoginRoute && !isVerifyRoute && hasToken) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminInfo");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);


export default api;