// src/services/playlistService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

/**
 * Lấy toàn bộ danh sách playlist (yêu cầu JWT Bearer token)
 */
export const getAllPlaylists = async (signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playlists`, {
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

    return data || [];
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
};
