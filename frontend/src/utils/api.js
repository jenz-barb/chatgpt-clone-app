import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chatgpt-backend-p3nm.onrender.com', // ✅ Your live backend URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
