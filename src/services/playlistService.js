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
 * GET /api/playlists?sort=listenCount,desc&limit=8
 */
export const getTopPlaylists = async (limit = 8, signal) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/playlists/top?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...authHeader(),
          Accept: 'application/json'
        },
        signal,
      }
    );

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
 * ✅ Lấy TOP playlist sắp xếp theo ngày tạo/phát hành giảm dần
 * GET /api/playlists?sort=createdAt,desc&limit=8
 */
export const getNewestPlaylists = async (limit = 8, signal) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/playlists/top/new?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...authHeader(),
          Accept: 'application/json'
        },
        signal,
      }
    );

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching TOP newest playlists:', error);
    return [];
  }
};


