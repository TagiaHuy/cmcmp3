// src/services/playlistService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

/* --------------------------------------------------------
   ⭐ Normalize playlist để 100% FE luôn chạy đúng
-------------------------------------------------------- */
const normalizePlaylist = (p) => {
  if (!p) return null;

  return {
    id: p.id,
    title: p.title || p.name || "Playlist",
    imageUrl: p.imageUrl || "",
    artist: p.artist || p.creatorDisplayName || "",
    // tránh lỗi artists dạng object array
    artistText: Array.isArray(p.artist)
      ? p.artist.map(a => a?.name).join(", ")
      : p.artist || p.creatorDisplayName || "Không rõ nghệ sĩ",

    songs: Array.isArray(p.songs) ? p.songs : [],

    // fallback cho play button
    mediaSrc: p.mediaSrc || null,

    listenCount: p.listenCount || 0,
    likeCount: p.likeCount || 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

/* --------------------------------------------------------
   ⭐ Fetch wrapper: đảm bảo không crash UI
-------------------------------------------------------- */
const fetchSafe = async (url, signal) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...authHeader(),
        Accept: "application/json",
      },
      signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg =
        (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return null;
  }
};

/* --------------------------------------------------------
   ⭐ Lấy tất cả playlist
-------------------------------------------------------- */
export const getAllPlaylists = async (signal) => {
  const data = await fetchSafe(`${API_BASE_URL}/api/playlists`, signal);
  if (!Array.isArray(data)) return [];
  return data.map(normalizePlaylist);
};

/* --------------------------------------------------------
   ⭐ Lấy playlist theo ID
-------------------------------------------------------- */
export const getPlaylistById = async (id, signal) => {
  const data = await fetchSafe(`${API_BASE_URL}/api/playlists/${id}`, signal);
  return normalizePlaylist(data);
};

/* --------------------------------------------------------
   ⭐ TOP playlist theo lượt nghe giảm dần
-------------------------------------------------------- */
export const getTopPlaylists = async (limit = 8, signal) => {
  const data = await fetchSafe(
    `${API_BASE_URL}/api/playlists/top?limit=${limit}`,
    signal
  );

  return Array.isArray(data)
    ? data.map(normalizePlaylist)
    : [];
};

/* --------------------------------------------------------
   ⭐ TOP playlist mới nhất
-------------------------------------------------------- */
export const getNewestPlaylists = async (limit = 8, signal) => {
  const data = await fetchSafe(
    `${API_BASE_URL}/api/playlists/top/new?limit=${limit}`,
    signal
  );

  return Array.isArray(data)
    ? data.map(normalizePlaylist)
    : [];
};

/* --------------------------------------------------------
   ⭐ TOP playlist theo lượt thích giảm dần
-------------------------------------------------------- */
export const getPlaylistsByTopLikes = async (limit = 8, signal) => {
  const data = await fetchSafe(
    `${API_BASE_URL}/api/playlists/top/likes?limit=${limit}`,
    signal
  );

  return Array.isArray(data)
    ? data.map(normalizePlaylist)
    : [];
};
