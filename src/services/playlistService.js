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
      method: 'GET',
      headers: {
        ...authHeader(),
        Accept: 'application/json',
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
    console.error('Error fetching playlists:', error);
    return [];
  }
};

/**
 * Lấy thông tin một playlist bằng ID (yêu cầu JWT Bearer token)
 */
export const getPlaylistById = async (id, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playlists/${id}`, {
      method: 'GET',
      headers: {
        ...authHeader(),
        Accept: 'application/json',
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
    console.error(`Error fetching playlist with ID ${id}:`, error);
    return null; // đồng bộ với songService.getSongById
  }
};

/**
 * ✅ Lấy TOP playlist sắp xếp theo lượt nghe giảm dần
 * Không cần token
 * GET /api/playlists/top?limit=8
 */
export const getTopPlaylists = async (limit = 8, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playlists/top?limit=${limit}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching TOP playlists:', error);
    return [];
  }
};

/**
 * PLACEHOLDER: Lấy TOP playlist sắp xếp theo ngày tạo/phát hành giảm dần
 */
export const getPlaylistsByReleaseDate = async (limit = 8, signal) => {
  console.warn('getPlaylistsByReleaseDate is a placeholder and does not fetch real data yet.');
  // const res = await fetch(`${API_BASE_URL}/api/playlists/newest?limit=${limit}`, { ... });
  return Promise.resolve([]);
};

/**
 * PLACEHOLDER: Lấy TOP playlist sắp xếp theo lượt thích giảm dần
 */
export const getPlaylistsByLikes = async (limit = 8, signal) => {
  console.warn('getPlaylistsByLikes is a placeholder and does not fetch real data yet.');
  // const res = await fetch(`${API_BASE_URL}/api/playlists/most-liked?limit=${limit}`, { ... });
  return Promise.resolve([]);
};
