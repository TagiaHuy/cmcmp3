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
    const res = await fetch(`${API_BASE_URL}/api/songs?sort=listenCount,desc&limit=${limit}`, {
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
 * Lấy TOP bài hát sắp xếp theo ngày phát hành giảm dần
 */
export const getSongsByReleaseDate = async (limit = 9, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs?sort=createdAt,desc&limit=${limit}`, {
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
    const res = await fetch(`${API_BASE_URL}/api/songs?sort=likeCount,desc&limit=${limit}`, {
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
 * Lấy danh sách bài hát theo mảng IDs
 */
export const getSongsByIds = async (ids, signal) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }
  try {
    const songPromises = ids.map(id => getSongById(id, signal).catch(() => null));
    const songs = await Promise.all(songPromises);
    return songs.filter(Boolean); // Filter out any nulls from failed fetches
  } catch (error) {
    console.error("Error fetching songs by IDs:", error);
    return [];
  }
};