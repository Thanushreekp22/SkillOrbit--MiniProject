import api from './axios';

// Activity Log
export const getMyActivity = async (limit = 100, action = null) => {
  const params = { limit };
  if (action) params.action = action;
  
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
    params,
  };
  
  return api.get('/admin/my-activity', config);
};

// Admin Management
export const getAllAdmins = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  };
  
  return api.get('/admin/all', config);
};

export const createAdmin = async (adminData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  };
  
  return api.post('/admin/create', adminData, config);
};

export const toggleAdminStatus = async (adminId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  };
  
  return api.put(`/admin/toggle-status/${adminId}`, {}, config);
};

export const unlockAdminAccount = async (adminId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  };
  
  return api.put(`/admin/unlock/${adminId}`, {}, config);
};

export const getAdminStatistics = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  };
  
  return api.get('/admin/statistics', config);
};

export const getAdminActivity = async (adminId, limit = 50) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
    params: { limit },
  };
  
  return api.get(`/admin/activity/${adminId}`, config);
};
