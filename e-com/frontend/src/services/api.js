import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle errors globally (like 401 Unauthorized) and auto-refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and we haven't already retried this request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      // If the request itself was to the refresh token endpoint, do not attempt to refresh again
      if (originalRequest.url && originalRequest.url.includes('/refresh')) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return API(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // Call raw axios to perform the token refresh to avoid global request interceptors
          const response = await axios.post(`http://localhost:8000/refresh?token=${refreshToken}`);
          const { access_token } = response.data;

          localStorage.setItem('token', access_token);
          
          // Dispatch a custom event to synchronize the react AuthContext state
          window.dispatchEvent(new CustomEvent('token-refreshed', { detail: access_token }));

          // Process any queued failed requests with the new token
          processQueue(null, access_token);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return API(originalRequest);
        } catch (refreshError) {
          // Refresh token is invalid/expired - force logout
          processQueue(refreshError, null);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('role');
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available, clear credentials and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
