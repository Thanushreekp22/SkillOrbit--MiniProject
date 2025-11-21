import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get admin token from localStorage
const getAdminToken = () => localStorage.getItem('adminToken');

// Create axios instance with admin token
const adminApi = axios.create({
  baseURL: API_URL
});

// Add token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin Authentication
export const adminLogin = (credentials) => 
  axios.post(`${API_URL}/api/admin/login`, credentials);

export const getAdminProfile = () => 
  adminApi.get('/api/admin/profile');

export const updateAdminProfile = (data) => 
  adminApi.put('/api/admin/profile', data);

export const changeAdminPassword = (passwords) => 
  adminApi.put('/api/admin/change-password', passwords);

// Question Management
export const getAllQuestions = (params) => 
  adminApi.get('/api/admin/dashboard/questions', { params });

export const getQuestionById = (id) => 
  adminApi.get(`/api/admin/dashboard/questions/${id}`);

export const addQuestion = (questionData) => 
  adminApi.post('/api/admin/dashboard/questions', questionData);

export const updateQuestion = (id, questionData) => 
  adminApi.put(`/api/admin/dashboard/questions/${id}`, questionData);

export const deleteQuestion = (id) => 
  adminApi.delete(`/api/admin/dashboard/questions/${id}`);

export const bulkAddQuestions = (questions) => 
  adminApi.post('/api/admin/dashboard/questions/bulk', { questions });

export const exportQuestions = (params) => 
  adminApi.get('/api/admin/dashboard/questions/export', { params });

// Analytics
export const getPlatformAnalytics = () => 
  adminApi.get('/api/admin/dashboard/analytics');

export const getQuestionStatistics = () => 
  adminApi.get('/api/admin/dashboard/questions/statistics');

// User Management
export const getUserManagementData = (params) => 
  adminApi.get('/api/admin/dashboard/users', { params });

export default adminApi;
