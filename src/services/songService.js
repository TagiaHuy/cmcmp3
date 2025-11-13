// src/services/songService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';  // thêm hàm lấy token

/**
 * Lấy toàn bộ danh sách bài hát (yêu cầu JWT Bearer token)
 */
export const getAllSongs = async (page = 0, size = 10, sortBy = 'createdAt', direction = 'desc', signal) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction,
    }).toString();

    const res = await fetch(`${API_BASE_URL}/api/songs?${queryParams}`, {
      method: "GET",
      headers: {
        ...authHeader(),
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

export const getSongsByArtist = async (artistId, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/artists/${artistId}/songs`, {
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
    return [];
  }
};

/**
 * ✅ Lấy TOP bài hát sắp xếp theo lượt nghe giảm dần
 * Không cần token
 * GET /api/songs/top?limit=10
 */
export const getTopSongs = async (limit = 10, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/top?limit=${limit}`, {
      method: "GET",
      headers: {
        ...authHeader(),
        Accept: "application/json"
      },
      signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const songs = Array.isArray(data) ? data : [];

    // Add mediaSrc to each song
    return songs.map(song => ({
      ...song,
      mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
    }));
    
  } catch (error) {
    return [];
  }
};

/**
 * Lấy TOP bài hát sắp xếp theo ngày phát hành giảm dần
 */
export const getNewestSongs = async (limit = 9, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/top/new-releases?limit=${limit}`, {
      method: "GET",
      headers: {
        ...authHeader(),
        Accept: "application/json"
      },
      signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const songs = Array.isArray(data) ? data : [];
    return songs.map(song => ({
      ...song,
      mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
    }));
  } catch (error) {
    console.error("Error fetching TOP new releases songs:", error);
    return [];
  }
};

/**
 * Lấy TOP bài hát sắp xếp theo lượt thích giảm dần
 */
export const getSongsByLikes = async (limit = 9, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/top/most-liked?limit=${limit}`, {
      method: "GET",
      headers: {
        ...authHeader(),
        Accept: "application/json"
      },
      signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const songs = Array.isArray(data) ? data : [];
    return songs.map(song => ({
      ...song,
      mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
    }));
  } catch (error) {
    console.error("Error fetching TOP most liked songs:", error);
    return [];
  }
};

/**
 * Lấy danh sách các bài hát đã tải lên của người dùng hiện tại
 */
export const getUploadedSongs = async (signal) => {
  const res = await fetch(`${API_BASE_URL}/api/songs/uploaded`, {
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
};



