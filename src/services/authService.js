// src/services/authService.js
import { safeJson } from "../utils/http";
import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api/auth`;

/** Gửi mã OTP đến email */
export const sendOtp = async (email, signal) => {
  const res = await fetch(`${API_URL}/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Không thể gửi OTP (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data;
};

/** Đăng ký tài khoản */
export const register = async (displayName, email, password, otp, signal) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ displayName, email, password, otp }),
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
    method: 'POST',
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

/** Đổi mật khẩu cho user đã đăng nhập (cần Bearer token) */
export const changePassword = async (token, oldPassword, newPassword, signal) => {
  const res = await fetch(`${API_BASE_URL}/api/users/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({ oldPassword, newPassword }),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
};

/** Yêu cầu gửi OTP để reset mật khẩu */
export const forgotPassword = async (email, signal) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Không thể gửi yêu cầu (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data;
};

/** Đặt lại mật khẩu bằng OTP */
export const resetPassword = async (email, otp, newPassword, signal) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, otp, newPassword }),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Không thể đặt lại mật khẩu (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data;
};

/** Đăng nhập ban đầu (Xác thực Email/Mật khẩu và Gửi OTP) */
export const loginAndSendOtp = async (email, password, signal) => {
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
      (res.status === 401 ? "Tài khoản không tồn tại hoặc mật khẩu không đúng." : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data; // { message: "Xác thực thành công, vui lòng nhập mã OTP" }
};

/** Xác thực OTP và Hoàn tất Đăng nhập */
export const verifyLoginOtp = async (email, otp, signal) => {
  const res = await fetch(`${API_URL}/verify-login-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, otp }),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (res.status === 400 ? "Mã OTP không hợp lệ hoặc đã hết hạn." : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data; // { message, user, token }
};
