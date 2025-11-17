// src/services/playlistService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

/* --------------------------------------------------------
   ⭐ Normalize playlist to ensure FE consistency
-------------------------------------------------------- */
const normalizePlaylist = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title || "Playlist không tên",
    description: p.description || "",
    imageUrl: p.imageUrl || "",
    listenCount: p.playCount || 0, // API uses playCount
    likeCount: p.likeCount || 0,
    songCount: p.songCount || 0,
    artist: p.ownerName || "Không rõ", // API uses ownerName
    artistText: p.ownerName || "Không rõ",
    songs: Array.isArray(p.songs) ? p.songs : [], // Expecting array of song IDs
    createdAt: p.createdAt,
  };
};

/* --------------------------------------------------------
   ⭐ Generic Fetch Wrapper
-------------------------------------------------------- */
const fetchApi = async (url, options = {}) => {
  const headers = {
    ...authHeader(),
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 204) { // No Content
    return null;
  }

  const data = await safeJson(response);

  if (!response.ok) {
    const message = data?.message || `API Error: ${response.status}`;
    throw new Error(message);
  }

  return data;
};


/* --------------------------------------------------------
   ⭐ API Functions
-------------------------------------------------------- */

export const getAllPlaylists = async (signal) => {
  const data = await fetchApi(`${API_BASE_URL}/api/playlists`, { signal });
  return Array.isArray(data) ? data.map(normalizePlaylist) : [];
};

export const getPlaylistById = async (id, signal) => {
  const data = await fetchApi(`${API_BASE_URL}/api/playlists/${id}`, { signal });
  return normalizePlaylist(data);
};

export const createPlaylist = async (playlistData, signal) => {
  const { title, description, imageUrl } = playlistData;
  const body = JSON.stringify({ title, description, imageUrl });
  const data = await fetchApi(`${API_BASE_URL}/api/playlists`, {
    method: 'POST',
    body,
    signal,
  });
  return normalizePlaylist(data);
};

export const updatePlaylist = async (id, playlistData, signal) => {
  const { title, description, imageUrl } = playlistData;
  const body = JSON.stringify({ title, description, imageUrl });
  const data = await fetchApi(`${API_BASE_URL}/api/playlists/${id}`, {
    method: 'PUT',
    body,
    signal,
  });
  return normalizePlaylist(data);
};

export const deletePlaylist = async (id, signal) => {
  await fetchApi(`${API_BASE_URL}/api/playlists/${id}`, {
    method: 'DELETE',
    signal,
  });
};

export const addSongsToPlaylist = async (playlistId, songIds, signal) => {
  const body = JSON.stringify({ songIds });
  const data = await fetchApi(`${API_BASE_URL}/api/playlists/${playlistId}/songs`, {
    method: 'POST',
    body,
    signal,
  });
  return normalizePlaylist(data);
};

export const removeSongFromPlaylist = async (playlistId, songId, signal) => {
  await fetchApi(`${API_BASE_URL}/api/playlists/${playlistId}/songs/${songId}`, {
    method: 'DELETE',
    signal,
  });
};

// --- Functions for TOP playlists (can be added as needed) ---

export const getTopPlaylists = async (limit = 8, signal) => {
  const data = await fetchApi(`${API_BASE_URL}/api/playlists/top?limit=${limit}`, { signal });
  return Array.isArray(data) ? data.map(normalizePlaylist) : [];
};

export const getNewestPlaylists = async (limit = 8, signal) => {
  const data = await fetchApi(`${API_BASE_URL}/api/playlists/top/new?limit=${limit}`, { signal });
  return Array.isArray(data) ? data.map(normalizePlaylist) : [];
};

export const getPlaylistsByTopLikes = async (limit = 8, signal) => {
  const data = await fetchApi(`${API_BASE_URL}/api/playlists/top/likes?limit=${limit}`, { signal });
  return Array.isArray(data) ? data.map(normalizePlaylist) : [];
};
