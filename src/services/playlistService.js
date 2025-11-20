import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

const BASE_URL = `${API_BASE_URL}/api/playlists`;

// 1. Get user's created playlists
export const getPlaylistsMe = async (signal) => {
  const headers = { ...authHeader(), Accept: 'application/json' };
  const hasAuth = !!headers.Authorization; // có token hay không

  const res = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers,
    signal,
  });

  const data = await safeJson(res);

  // Nếu KHÔNG có token thì coi mọi lỗi là "chưa đăng nhập" -> trả [] và KHÔNG throw
  if (!res.ok) {
    if (!hasAuth) {
      return [];
    }
    // Có token mà vẫn lỗi -> ném ra cho Toast xử lý
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return Array.isArray(data) ? data : [];
};

// 2. Create a new playlist
export const createPlaylist = async (playlistData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { ...authHeader() },
    body: playlistData,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

// 3. Delete a playlist
export const deletePlaylist = async (playlistId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  // No content on success
};

// 4. Get songs in a specific playlist
export const getPlaylistSongs = async (playlistId, signal) => {
  const res = await fetch(`${BASE_URL}/${playlistId}/songs`, {
    method: 'GET',
    headers: { ...authHeader(), Accept: 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};

// 5. Add/remove songs from a playlist
export const updatePlaylistSongs = async (playlistId, songUpdates) => {
  const res = await fetch(`${BASE_URL}/${playlistId}/songs`, {
    method: 'PATCH',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(songUpdates),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

// 6. Update playlist details (name, privacy)
export const updatePlaylist = async (playlistId, playlistData) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: 'PUT',
    headers: { ...authHeader() },
    body: playlistData,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

// 7. Get a single playlist by ID
export const getPlaylistById = async (playlistId, signal) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: 'GET',
    headers: { ...authHeader(), Accept: 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

// 8. Get Top Playlists
export const getTopPlaylists = async (limit = 5, signal) => {
  const res = await fetch(`${BASE_URL}/top?limit=${limit}`, {
    method: 'GET',
    headers: { ...authHeader(), Accept: 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};

// 9. Get New Release Playlists
export const getNewReleasePlaylists = async (limit = 5, signal) => {
  const res = await fetch(`${BASE_URL}/top/new-releases?limit=${limit}`, {
    method: 'GET',
    headers: { ...authHeader(), Accept: 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};

// 10. Get Most Liked Playlists
export const getMostLikedPlaylists = async (limit = 5, signal) => {
  const res = await fetch(`${BASE_URL}/top/most-liked?limit=${limit}`, {
    method: 'GET',
    headers: { ...authHeader(), Accept: 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};

// 11. Like a playlist
export const likePlaylist = async (playlistId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}/like`, {
    method: 'POST',
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
};

// 12. Unlike a playlist
export const unlikePlaylist = async (playlistId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}/like`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
};
