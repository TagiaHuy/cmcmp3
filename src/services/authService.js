// src/services/authService.js
import { safeJson } from "../utils/http";
import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api/auth`;

/** Đăng ký tài khoản */
export const register = async (displayName, email, password, signal) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ displayName, email, password }),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (res.status === 400 ? "Đăng ký thất bại (400)" : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data; // { token, user } hoặc payload BE trả
};

/** Đăng nhập */
export const login = async (email, password, signal) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (res.status === 401 ? "Sai email hoặc mật khẩu (401)" : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data; // { token, user } …
};

/** Lấy thông tin user hiện tại (cần Bearer token) */
export const getUserMe = async (token, signal) => {
  const res = await fetch(`${API_BASE_URL}/api/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, 
      Accept: "application/json",
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (res.status === 403
        ? "Không có quyền truy cập (403)"
        : res.status === 401
        ? "Token không hợp lệ/hết hạn (401)"
        : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data; // { id, email, ... } hoặc { user: {...} }
};

/** Cập nhật thông tin user (cần Bearer token) */
export const updateUserProfile = async (token, profileData, signal) => {
  const res = await fetch(`${API_BASE_URL}/api/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(profileData),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
};

/** Cập nhật avatar user (cần Bearer token) */
export const updateUserAvatar = async (token, formData, signal) => {
  const res = await fetch(`${API_BASE_URL}/api/me/avatar`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: formData, // FormData sẽ tự động set Content-Type là multipart/form-data
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
};
