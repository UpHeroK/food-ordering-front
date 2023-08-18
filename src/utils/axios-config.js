import axios from 'axios';
import router from '@/router';

// axios.defaults.baseURL = 'http://localhost:8000/api/'; local
axios.defaults.baseURL = 'https://test-api.herotest.net/api/';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401 && router.currentRoute.path !== '/login') {
            localStorage.removeItem('token');
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default axios;