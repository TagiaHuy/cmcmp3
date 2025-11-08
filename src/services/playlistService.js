// src/services/playlistService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

/**
 * Lấy toàn bộ danh sách playlist (yêu cầu JWT Bearer token)
 */

/**
 * ✅ Lấy TOP playlist sắp xếp theo lượt nghe giảm dần
 * Không cần token
 * GET /api/playlists/top?limit=8
 */
export const getTopPlaylists = async (limit = 8, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playlists/top?limit=${limit}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching TOP playlists:", error);
    return [];
  }
};


/**
 * Lấy thông tin một playlist bằng ID (yêu cầu JWT Bearer token)
 * @param {string} playlistId - ID của playlist cần lấy
 * @param {AbortSignal} signal - Abort signal để cancel request
 */
export const getPlaylistById = async (playlistId, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}`, {
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
    console.error(`Error fetching playlist with ID ${playlistId}:`, error);
    throw error; // Re-throw the error to be caught by the calling hook
  }
};

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
