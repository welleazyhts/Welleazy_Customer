import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://3.110.32.224:8000';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Enable cookies for session management
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);
