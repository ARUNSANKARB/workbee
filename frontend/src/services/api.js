import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* AUTH APIS */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

/* WORKER APIS */
export const workerAPI = {
  createProfile: (data) => api.post('/workers/profile', data),
  getProfile: (id) => api.get(`/workers/${id}`),
  getByCategory: (categoryId, params) => api.get(`/workers/category/${categoryId}`, { params }),
  search: (params) => api.get('/workers/search', { params }),
  uploadDocument: (data) => api.post('/workers/upload-document', data),
  updateAvailability: (data) => api.put('/workers/availability', data),
  getReviews: (id, params) => api.get(`/workers/${id}/reviews`, { params }),
  getEarnings: (id) => api.get(`/workers/earnings/${id}`),
};

/* BOOKING APIS */
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  accept: (id) => api.put(`/bookings/${id}/accept`),
  reject: (id, data) => api.put(`/bookings/${id}/reject`, data),
  cancel: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  start: (id) => api.put(`/bookings/${id}/start`),
  complete: (id, data) => api.put(`/bookings/${id}/complete`, data),
};

/* REVIEW APIS */
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByWorker: (workerId, params) => api.get(`/reviews/worker/${workerId}`, { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id, data) => api.put(`/reviews/${id}/helpful`, data),
};

/* CATEGORY APIS */
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
};

/* ADMIN APIS */
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  suspendUser: (id, data) => api.put(`/admin/users/${id}/suspend`, data),
  unsuspendUser: (id) => api.put(`/admin/users/${id}/unsuspend`),
  getPendingWorkers: (params) => api.get('/admin/workers/pending', { params }),
  approveWorker: (id) => api.put(`/admin/workers/${id}/approve`),
  rejectWorker: (id, data) => api.put(`/admin/workers/${id}/reject`, data),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

export default api;
