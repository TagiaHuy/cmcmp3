import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

const BASE_URL = `${API_BASE_URL}/api/playlists`;

// 1. Get user's created playlists
export const getPlaylistsMe = async (signal) => {
  const res = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: { ...authHeader(), 'Accept': 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};

// 2. Create a new playlist
export const createPlaylist = async (playlistData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(playlistData),
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
    headers: { ...authHeader(), 'Accept': 'application/json' },
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
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(playlistData),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

// 7. Get a single playlist by ID
export const getPlaylistById = async (playlistId, signal) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: 'GET',
    headers: { ...authHeader(), 'Accept': 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

// 8. Get Top Playlists (assuming endpoint exists)
export const getTopPlaylists = async (limit = 5, signal) => {
  const res = await fetch(`${BASE_URL}/top?limit=${limit}`, {
    method: 'GET',
    headers: { ...authHeader(), 'Accept': 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};

// 9. Get Newest Playlists (assuming endpoint exists)
export const getNewestPlaylists = async (limit = 5, signal) => {
  const res = await fetch(`${BASE_URL}/newest?limit=${limit}`, {
    method: 'GET',
    headers: { ...authHeader(), 'Accept': 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};

// 10. Get Top Liked Playlists (assuming endpoint exists)
export const getPlaylistsByTopLikes = async (limit = 5, signal) => {
  const res = await fetch(`${BASE_URL}/top-liked?limit=${limit}`, {
    method: 'GET',
    headers: { ...authHeader(), 'Accept': 'application/json' },
    signal,
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return Array.isArray(data) ? data : [];
};
