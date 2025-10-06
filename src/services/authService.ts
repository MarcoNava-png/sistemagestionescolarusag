// src/lib/authService.ts
'use client';

import { apiFetch } from '@/lib/fetcher'; // usa tu helper actual

type ApiResponse<T> = { data: T; isSuccess: boolean; messageError?: string | null };

export type LoginData = {
  userId: string;
  email: string;
  role: string;
  token: string;
  expiration: string; // ISO
};

// ---- helpers cookies ----
function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; Path=/; SameSite=Lax; Secure; Expires=${expires}`;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// ---- JWT decode para validar expiración en cliente (opcional) ----
function decode<T = any>(jwt: string): T | null {
  try { return JSON.parse(atob(jwt.split('.')[1])); } catch { return null; }
}

export async function login(email: string, password: string) {
  const res = await apiFetch<ApiResponse<LoginData>>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.isSuccess) throw new Error(`Login failed: ${res.messageError ?? 'Error'}`);

  const u = res.data;

  // Guarda cookie para middleware/SSR
  setCookie('auth_token', u.token, 1);

  // (opcional) guarda en localStorage para tu fetch en cliente
  localStorage.setItem('token', u.token);
  localStorage.setItem('usuario', JSON.stringify({ userId: u.userId, email: u.email, role: u.role }));
  localStorage.setItem('role', u.role);

  return u;
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem('token') ?? '';
}

export function isTokenExpired(token: string) {
  const payload = decode<any>(token);
  return !payload || (payload.exp && payload.exp * 1000 < Date.now());
}

export async function validateSession():
  Promise<{ userId: string | number; role: string } | null> {
  const token = getTokenFromLocalStorage();
  if (!token || isTokenExpired(token)) {
    await logout();
    return null;
  }
  const u = localStorage.getItem('usuario');
  if (u) return JSON.parse(u);
  return null;
}

export async function logout() {
  deleteCookie('auth_token');
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('role');
}
