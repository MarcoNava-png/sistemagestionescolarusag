// lib/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7169',
  withCredentials: false,             // <= TRUE solo si tu backend usa cookies/sesión
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (e) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[HTTP ERROR]', {
        baseURL: http.defaults.baseURL,
        url: e?.config?.url,
        status: e?.response?.status,
        data: e?.response?.data,
        msg: e?.message
      });
    }
    return Promise.reject(e);
  }
);
