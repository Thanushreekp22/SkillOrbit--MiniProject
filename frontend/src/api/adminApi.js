import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = API_BASE_URL.replace('/api', ''); // Remove /api suffix if present

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

// Activity Logs
export const getMyActivity = (params) => 
  adminApi.get('/api/admin/my-activity', { params });

export const getAdminActivity = (adminId, params) => 
  adminApi.get(`/api/admin/activity/${adminId}`, { params });

// Admin Management (Super Admin only)
export const getAllAdmins = () => 
  adminApi.get('/api/admin/all');

export const createAdmin = (adminData) => 
  adminApi.post('/api/admin/create', adminData);

export const toggleAdminStatus = (adminId) => 
  adminApi.put(`/api/admin/toggle-status/${adminId}`);

export const unlockAdminAccount = (adminId) => 
  adminApi.put(`/api/admin/unlock/${adminId}`);

export const getAdminStatistics = () => 
  adminApi.get('/api/admin/statistics');

export default adminApi;
