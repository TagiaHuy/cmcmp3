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
const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

// 🟢 Chuẩn hóa tags (tránh bị object)
const normalizeTags = (tags) => {
  if (!tags) return "Không có";
  if (typeof tags === "string") return tags;
  if (Array.isArray(tags)) return tags.map(t => t.name || t).join(", ");
  if (typeof tags === "object") return tags.name || JSON.stringify(tags);
  return String(tags);
};

const mapSong = (song) => {
  if (!song) return null;
  const artistEntities = toArray(song.artists);
  const tagEntities = toArray(song.tags);
  return {
    ...song,
    artistEntities,
    tagEntities,
    artists: normalizeArtists(song.artists),
    tags: normalizeTags(song.tags), // Add this line
    mediaSrc: song.filePath,
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

/* ==========================================================
    8) LIKE A SONG
========================================================== */
export const likeSong = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${id}/like`, {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
      throw new Error(errorData.message);
    }
    if (res.status === 204 || res.status === 200) { 
        return { success: true };
    }
    return await res.json();
  } catch (error) {
    console.error(`Error liking song with ID ${id}:`, error);
    throw error;
  }
};

/* ==========================================================
    9) UNLIKE A SONG
========================================================== */
export const unlikeSong = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${id}/like`, {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
      throw new Error(errorData.message);
    }
    if (res.status === 204 || res.status === 200) { // No Content
        return { success: true };
    }
    return await res.json();
  } catch (error) {
    console.error(`Error unliking song with ID ${id}:`, error);
    throw error;
  }
};

/* ==========================================================
    10) INCREASE LISTEN COUNT
========================================================== */
export const increaseListenCount = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${id}/listen`, {
      method: "PUT",
      headers: {
        ...authHeader(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
      throw new Error(errorData.message);
    }
    // Listen count endpoint might not return a body
    return { success: true };
  } catch (error) {
    console.error(`Error increasing listen count for song with ID ${id}:`, error);
    // Don't re-throw, as this is a background task and shouldn't interrupt user.
  }
};

export const getSongsAdmin = async (page = 0, size = 10, signal) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
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

    if (!res.ok) {
        const msg = data?.message || data?.error || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
};
export const deleteSong = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeader(),
        Accept: "application/json",
      },
    });

    if (res.status === 204 || res.status === 200) {
      return { success: true };
    }

    const data = await safeJson(res);
    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error(`Error deleting song ${id}:`, error);
    throw error;
  }
};
export const updateUploadedSong = async (id, formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/uploaded/${id}`, {
      method: "PUT",
      headers: {
        ...authHeader(),
      },
      body: formData,
    });

    const data = await safeJson(res);
    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return mapSong(data);
  } catch (error) {
    console.error(`Error updating uploaded song ${id}:`, error);
    throw error;
  }
};

export const updateUploadedSongStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/uploaded/${id}?status=${status}`, {
      method: "PUT",
      headers: {
        ...authHeader(),
      },
    });

    const data = await safeJson(res);
    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return mapSong(data);
  } catch (error) {
    console.error(`Error updating status for uploaded song ${id}:`, error);
    throw error;
  }
};


export const getSongsByUserId = async (userId, page = 0, size = 10, signal) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    }).toString();

    const res = await fetch(`${API_BASE_URL}/api/users/${userId}/songs?${queryParams}`, {
        method: "GET",
        headers: {
            ...authHeader(),
            Accept: "application/json",
        },
        signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
        const msg = data?.message || data?.error || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
};


export const getUnapprovedSongs = async (page = 0, size = 10, signal) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  }).toString();

  const res = await fetch(`${API_BASE_URL}/api/admin/songs/pending?${queryParams}`, {
    method: "GET",
    headers: {
      ...authHeader(),
      Accept: "application/json",
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return {
    content: Array.isArray(data.content) ? data.content.map(mapSong) : [],
    totalPages: data.totalPages || 0,
  };
};

export const approveSong = async (songId) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/songs/${songId}/approve`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });

  const data = await safeJson(res);
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return mapSong(data);
};

export const rejectSong = async (songId) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/songs/${songId}/reject`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });

  const data = await safeJson(res);
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return mapSong(data);
};