import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

// Destinations services
export const destinationService = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id) => api.delete(`/destinations/${id}`),
};

// Gallery services
export const galleryService = {
  getAll: () => api.get('/gallery'),
  upload: (formData) => api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Hero content services
export const heroService = {
  get: () => api.get('/hero'),
  update: (data) => api.put('/hero', data),
};

// Navigation services
export const navService = {
  getAll: () => api.get('/navigation'),
  update: (data) => api.put('/navigation', data),
};

// Contact services
export const contactService = {
  getInfo: () => api.get('/contact'),
  updateInfo: (data) => api.put('/contact', data),
  sendMessage: (data) => api.post('/contact/send', data),
};

export default api;
