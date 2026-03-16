// src/api/http.ts
import axios, { AxiosError, type AxiosInstance } from 'axios';

// If you're using Vite:
const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

function getAccessToken(): string | null {
  // adjust to your auth strategy (localStorage, cookies, pinia, etc.)
  return localStorage.getItem('access_token');
}

export const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token if present
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: normalize errors + handle auth failures
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Network / CORS / timeout:
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: 'Network error. Check API availability/CORS.',
        raw: error,
      });
    }

    const status = error.response.status;
    const data = error.response.data;

    // Example: auto-logout on 401
    if (status === 401) {
      // You can also emit an event, call a store, or redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_user');
      // window.location.href = '/login';
    }

    // Return a consistent error shape
    return Promise.reject({
      status,
      message: error.message ?? 'Request failed',
      data,
      raw: error,
    });
  },
);
