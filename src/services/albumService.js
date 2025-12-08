import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

const BASE_URL = `${API_BASE_URL}/api/albums`;

// 1. Get user's created albums
export const getAlbumsMe = async (signal) => {
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

// 2. Get user's favorite albums
export const getFavoriteAlbums = async (signal) => {
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

// 3. Get a single album by ID
export const getAlbumById = async (albumId, signal) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}`, {
      method: 'GET',
      headers: { ...authHeader(), Accept: 'application/json' },
      signal,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching album by ID:', error);
    throw error;
  }
};

// 4. Create a new album
export const createAlbum = async (albumData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { ...authHeader() },
      body: albumData, // albumData should be FormData for multipart/form-data
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error creating album:', error);
    throw error;
  }
};

// 5. Update album details
export const updateAlbum = async (albumId, albumData) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}`, {
      method: 'PUT',
      headers: { ...authHeader() },
      body: albumData, // albumData should be FormData for multipart/form-data
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error updating album:', error);
    throw error;
  }
};

// 6. Delete an album
export const deleteAlbum = async (albumId) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}`, {
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
    console.error('Error deleting album:', error);
    throw error;
  }
};

// 7. Like an album
export const likeAlbum = async (albumId) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}/like`, {
      method: 'POST',
      headers: { ...authHeader() },
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error liking album:', error);
    throw error;
  }
};

// 8. Unlike an album (assuming POST to the same endpoint with toggle behavior or a separate DELETE)
// Based on the playlistService.js, it seems to be POST to /like for both like/unlike.
// If it's a toggle, this function would be the same as likeAlbum.
// If there's a separate "unlike" endpoint or method, this would need adjustment.
export const unlikeAlbum = async (albumId) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}/like`, {
      method: 'POST', // Assuming POST to toggle like status
      headers: { ...authHeader() },
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error unliking album:', error);
    throw error;
  }
};

// 9. Get songs in a specific album
export const getAlbumSongs = async (albumId, signal) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}/songs`, {
      method: 'GET',
      headers: { ...authHeader(), Accept: 'application/json' },
      signal,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching album songs:', error);
    throw error;
  }
};

// 10. Add/remove songs from an album
export const updateAlbumSongs = async (albumId, songUpdates) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}/songs`, {
      method: 'PATCH',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(songUpdates), // songUpdates should be UpdateAlbumSongsDTO { add: [...], remove: [...] }
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error updating album songs:', error);
    throw error;
  }
};