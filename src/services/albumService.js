// src/services/albumService.js
import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";
import { authHeader } from "../utils/auth";

const BASE_URL = `${API_BASE_URL}/api/albums`;

// ===============================
// Helper fetch: parse JSON + throw Error rõ ràng
// ===============================
const fetchJson = async (url, options = {}, signal) => {
  const res = await fetch(url, { ...options, signal });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

// ===============================
// 1) ME: albums user tạo (cần login)
// ===============================
export const getAlbumsMe = async (signal) => {
  const headers = { ...authHeader(), Accept: "application/json" };
  const hasAuth = !!headers.Authorization;

  try {
    const data = await fetchJson(
      `${BASE_URL}/me`,
      { method: "GET", headers },
      signal
    );
    return Array.isArray(data) ? data : [];
  } catch (e) {
    // Không có token -> im lặng trả []
    if (!hasAuth) return [];
    throw e;
  }
};

// ===============================
// 2) ME: favorite albums (cần login)
// ===============================
export const getFavoriteAlbums = async (signal) => {
  const headers = { ...authHeader(), Accept: "application/json" };
  const hasAuth = !!headers.Authorization;

  try {
    const data = await fetchJson(
      `${BASE_URL}/me/liked`,
      { method: "GET", headers },
      signal
    );
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (!hasAuth) return [];
    throw e;
  }
};

// ===============================
// 3) PUBLIC: tất cả albums (ai cũng xem được)
// ===============================
export const getAllAlbumsPublic = async (signal) => {
  const data = await fetchJson(
    `${BASE_URL}`,
    { method: "GET", headers: { Accept: "application/json" } },
    signal
  );
  return Array.isArray(data) ? data : [];
};

// ===============================
// 4) PUBLIC: album nổi bật HomePage
// ===============================
export const getTopAlbums = async (limit = 10, signal) => {
  const data = await fetchJson(
    `${BASE_URL}/top?limit=${limit}`,
    { method: "GET", headers: { Accept: "application/json" } },
    signal
  );
  return Array.isArray(data) ? data : [];
};

export const getTopNewAlbums = async (limit = 10, signal) => {
  const data = await fetchJson(
    `${BASE_URL}/top/new-releases?limit=${limit}`,
    { method: "GET", headers: { Accept: "application/json" } },
    signal
  );
  return Array.isArray(data) ? data : [];
};

export const getTopMostLikedAlbums = async (limit = 10, signal) => {
  const data = await fetchJson(
    `${BASE_URL}/top/most-liked?limit=${limit}`,
    { method: "GET", headers: { Accept: "application/json" } },
    signal
  );
  return Array.isArray(data) ? data : [];
};

// ✅ 1 hàm tổng hợp cho HomePage gọi cho tiện
// type: "new" | "liked" | "play" | "all"
export const getHomepageAlbums = async (
  { type = "new", limit = 10 } = {},
  signal
) => {
  switch (String(type).toLowerCase()) {
    case "liked":
      return getTopMostLikedAlbums(limit, signal);
    case "play":
      return getTopAlbums(limit, signal);
    case "all":
      return getAllAlbumsPublic(signal);
    case "new":
    default:
      return getTopNewAlbums(limit, signal);
  }
};

// ===============================
// 5) PUBLIC: Get a single album by ID
// ===============================
export const getAlbumById = async (albumId, signal) => {
  // Có token thì gửi kèm cũng được, không có thì vẫn ok
  const headers = { ...authHeader(), Accept: "application/json" };
  const data = await fetchJson(
    `${BASE_URL}/${albumId}`,
    { method: "GET", headers },
    signal
  );
  return data;
};

// ===============================
// 6) Create a new album (ADMIN/ARTIST)
// ===============================
export const createAlbum = async (albumData) => {
  const data = await fetchJson(`${BASE_URL}`, {
    method: "POST",
    headers: { ...authHeader(), Accept: "application/json" },
    body: albumData, // FormData
  });
  return data;
};

// ===============================
// 7) Update album details
// ===============================
export const updateAlbum = async (albumId, albumData) => {
  const data = await fetchJson(`${BASE_URL}/${albumId}`, {
    method: "PUT",
    headers: { ...authHeader(), Accept: "application/json" },
    body: albumData, // FormData
  });
  return data;
};

// ===============================
// 8) Delete an album
// ===============================
export const deleteAlbum = async (albumId) => {
  await fetchJson(`${BASE_URL}/${albumId}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
};

// ===============================
// 9) Like / Unlike album (toggle)
// ===============================
export const toggleLikeAlbum = async (albumId) => {
  // BE có thể trả message hoặc status -> mình trả true nếu ok
  const data = await fetchJson(`${BASE_URL}/${albumId}/like`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  return data ?? true;
};

// giữ tương thích code cũ:
export const likeAlbum = toggleLikeAlbum;
export const unlikeAlbum = toggleLikeAlbum;

// ===============================
// 10) Get songs in a specific album (PUBLIC endpoint của bạn)
// ===============================
export const getAlbumSongs = async (albumId, signal) => {
  const headers = { ...authHeader(), Accept: "application/json" }; // có token thì gửi, không có cũng ok
  const data = await fetchJson(
    `${BASE_URL}/${albumId}/songs`,
    { method: "GET", headers },
    signal
  );
  return Array.isArray(data) ? data : [];
};

// ===============================
// 11) Add/remove songs from an album
// ===============================
export const updateAlbumSongs = async (albumId, songUpdates) => {
  const data = await fetchJson(`${BASE_URL}/${albumId}/songs`, {
    method: "PATCH",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(songUpdates),
  });
  return data;
};
