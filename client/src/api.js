/**
 * Axios API Configuration
 * Centralized API layer with interceptors, retry logic, and proper navigation
 */

import axios from 'axios';

// Navigation function - will be set by App.jsx
let navigate = null;

/**
 * Set the navigation function from React Router
 * Call this in your App.jsx after router is initialized
 * @param {Function} navigateFn - React Router navigate function
 */
export const setNavigate = (navigateFn) => {
  navigate = navigateFn;
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

/**
 * Request Interceptor
 * Automatically attach JWT token to all requests
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle token expiration, errors, and implement retry logic
 */
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Use React Router navigation if available, fallback to window.location
      if (navigate && window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      } else if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Retry logic for network errors or 5xx errors
    if (
      !originalRequest._retry &&
      (error.code === 'ECONNABORTED' || 
       error.code === 'ERR_NETWORK' ||
       (error.response?.status >= 500 && error.response?.status < 600))
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Retry up to 2 times with exponential backoff
      if (originalRequest._retryCount <= 2) {
        const delay = Math.pow(2, originalRequest._retryCount) * 1000; // 2s, 4s
        
        if (import.meta.env.DEV) {
          console.log(`Retrying request (attempt ${originalRequest._retryCount}/2) after ${delay}ms...`);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        return API(originalRequest);
      }
    }

    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to handle API errors consistently
 * @param {Error} error - Axios error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default API;
