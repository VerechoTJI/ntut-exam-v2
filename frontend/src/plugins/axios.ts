import axios from 'axios';

// Interceptor to automatically attach the admin token to every request
axios.interceptors.request.use((config) => {
  // Try to get token from localStorage, fallback to the default 'admin-secret'
  const token = localStorage.getItem('adminToken') || 'admin-secret';
  
  if (config.url?.includes('/admin/')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;
