import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";
import { authHeader } from "../utils/auth";

export async function getAllUsers(page = 0, size = 10, signal) {
  const res = await fetch(`${API_BASE_URL}/api/admin/user?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      ...authHeader(),               // ⬅ BẮT BUỘC PHẢI CÓ DÒNG NÀY
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export async function getFavoriteSongs(signal) {
  const res = await fetch(`${API_BASE_URL}/api/songs/favorites`, {
    method: "GET",
    headers: {
      ...authHeader(),
      Accept: "application/json",
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

/**
 * Cập nhật cài đặt xác thực hai bước (2FA) cho người dùng.
 * @param {string} token - The authorization token.
 * @param {AbortSignal} signal - Abort signal.
 * @returns {Promise<object>} - Updated UserDTO object.
 */
export const updateTwoFactorPreference = async (token, signal) => {
  const res = await fetch(`${API_BASE_URL}/api/me/toggle-2fa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // Yêu cầu JWT token hợp lệ
    },
    body: JSON.stringify({}), // Empty JSON body
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Không thể cập nhật cài đặt 2FA (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data; // UserDTO object
};

export const requestArtistVerification = async (token, formData) => {
    const res = await fetch(`${API_BASE_URL}/api/me/request-artist-verification`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });
  
    if (!res.ok) {
      const data = await safeJson(res);
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
  
    // If the server returns no content, we don't need to parse json
    if (res.status === 201 || res.status === 204) {
        return {};
    }
    
    return await safeJson(res);
  };