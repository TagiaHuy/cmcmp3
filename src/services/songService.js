// src/services/songService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';  // thêm hàm lấy token

/**
 * Lấy toàn bộ danh sách bài hát (yêu cầu JWT Bearer token)
 */
export const getAllSongs = async (signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs`, {
      method: "GET",
      headers: {
        ...authHeader(),              // ⬅️  GỬI TOKEN KÈM THEO
        Accept: "application/json",
      },
      signal,
    });

    const data = await safeJson(res);        // ⬅️  TRÁNH crash khi body rỗng

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

export const getSongById = async (id, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${id}`, {
      method: "GET",
      headers: {
        ...authHeader(),
        Accept: "application/json",
      },
      signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching song with ID ${id}:`, error);
    return null;
  }
};
