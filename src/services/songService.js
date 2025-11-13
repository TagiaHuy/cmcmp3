// src/services/songService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

// 🟢 Chuẩn hóa artists (tránh bị object)
const normalizeArtists = (artists) => {
  if (!artists) return "Không rõ";
  if (typeof artists === "string") return artists;
  if (Array.isArray(artists)) return artists.map(a => a.name || a).join(", ");
  if (typeof artists === "object") return artists.name || JSON.stringify(artists);
  return String(artists);
};

// 🟢 Chuẩn hóa song trả về FE
const mapSong = (song) => {
  if (!song) return null;
  return {
    ...song,
    artists: normalizeArtists(song.artists),
    mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
  };
};

/* ==========================================================
    1) GET ALL SONGS (có token)
========================================================== */
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

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    return (Array.isArray(data) ? data : []).map(mapSong);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

/* ==========================================================
    2) GET SONG BY ID
========================================================== */
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
    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    return mapSong(data);
  } catch (error) {
    console.error(`Error fetching song with ID ${id}:`, error);
    return null;
  }
};

/* ==========================================================
    3) GET SONGS BY ARTIST
========================================================== */
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
    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    return (Array.isArray(data) ? data : []).map(mapSong);
  } catch (error) {
    return [];
  }
};

/* ==========================================================
    4) TOP SONGS — Listen count
========================================================== */
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
    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    return (Array.isArray(data) ? data : []).map(mapSong);
  } catch (error) {
    console.error("Error fetching TOP songs:", error);
    return [];
  }
};

/* ==========================================================
    5) NEWEST SONGS
========================================================== */
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
    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    return (Array.isArray(data) ? data : []).map(mapSong);
  } catch (error) {
    console.error("Error fetching TOP new songs:", error);
    return [];
  }
};

/* ==========================================================
    6) TOP LIKED SONGS
========================================================== */
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
    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    return (Array.isArray(data) ? data : []).map(mapSong);
  } catch (error) {
    console.error("Error fetching TOP liked songs:", error);
    return [];
  }
};

/* ==========================================================
    7) UPLOADED SONGS
========================================================== */
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
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

  return (Array.isArray(data) ? data : []).map(mapSong);
};
