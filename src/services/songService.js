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
 * PLACEHOLDER: Lấy TOP bài hát sắp xếp theo ngày phát hành giảm dần
 */
export const getSongsByReleaseDate = async (limit = 9, signal) => {
  console.warn("getSongsByReleaseDate is a placeholder and does not fetch real data yet.");
  // const res = await fetch(`${API_BASE_URL}/api/songs/newest?limit=${limit}`, { ... });
  return Promise.resolve([]);
};

/**
 * PLACEHOLDER: Lấy TOP bài hát sắp xếp theo lượt thích giảm dần
 */
export const getSongsByLikes = async (limit = 9, signal) => {
  console.warn("getSongsByLikes is a placeholder and does not fetch real data yet.");
  // const res = await fetch(`${API_BASE_URL}/api/songs/most-liked?limit=${limit}`, { ... });
  return Promise.resolve([]);
};



