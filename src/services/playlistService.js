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
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { ...authHeader() },
      body: playlistData,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error creating playlist:', error);
    throw error;
  }
};

// 3. Delete a playlist
export const deletePlaylist = async (playlistId) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
    // No content on success
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

// 4. Get songs in a specific playlist
export const getPlaylistSongs = async (playlistId, signal) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}/songs`, {
      method: 'GET',
      headers: { ...authHeader(), Accept: 'application/json' },
      signal,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching playlist songs:', error);
    throw error;
  }
};

// 5. Add/remove songs from a playlist
export const updatePlaylistSongs = async (playlistId, songUpdates) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}/songs`, {
      method: 'PATCH',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(songUpdates),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error updating playlist songs:', error);
    throw error;
  }
};

// 6. Update playlist details (name, privacy)
export const updatePlaylist = async (playlistId, playlistData) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: 'PUT',
      headers: { ...authHeader() },
      body: playlistData,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error updating playlist:', error);
    throw error;
  }
};

// 7. Get a single playlist by ID
export const getPlaylistById = async (playlistId, signal) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: 'GET',
      headers: { ...authHeader(), Accept: 'application/json' },
      signal,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching playlist by ID:', error);
    throw error;
  }
};

// 8. Get Top Playlists
export const getTopPlaylists = async (limit = 5, signal) => {
  try {
    const res = await fetch(`${BASE_URL}/top?limit=${limit}`, {
      method: 'GET',
      headers: { ...authHeader(), Accept: 'application/json' },
      signal,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching TOP playlists:', error);
    throw error;
  }
};

// 9. Get New Release Playlists
export const getNewReleasePlaylists = async (limit = 5, signal) => {
  try {
    const res = await fetch(`${BASE_URL}/top/new-releases?limit=${limit}`, {
      method: 'GET',
      headers: { ...authHeader(), Accept: 'application/json' },
      signal,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching TOP new playlists:', error);
    throw error;
  }
};

// 10. Get Most Liked Playlists
export const getMostLikedPlaylists = async (limit = 5, signal) => {
  try {
    const res = await fetch(`${BASE_URL}/top/most-liked?limit=${limit}`, {
      method: 'GET',
      headers: { ...authHeader(), Accept: 'application/json' },
      signal,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching TOP liked playlists:', error);
    throw error;
  }
};

// 11. Like a playlist
export const likePlaylist = async (playlistId) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}/like`, {
      method: 'POST',
      headers: { ...authHeader() },
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error liking playlist:', error);
    throw error;
  }
};

// 12. Unlike a playlist
export const unlikePlaylist = async (playlistId) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}/like`, {
      method: 'POST',
      headers: { ...authHeader() },
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error unliking playlist:', error);
    throw error;
  }
};

// 13. Get user's favorite playlists
export const getFavoritePlaylists = async (signal) => {
  const headers = { ...authHeader(), Accept: 'application/json' };
  const hasAuth = !!headers.Authorization;

  const res = await fetch(`${BASE_URL}/me/liked`, {
    method: 'GET',
    headers,
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    if (!hasAuth) {
      return [];
    }
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return Array.isArray(data) ? data : [];
};
