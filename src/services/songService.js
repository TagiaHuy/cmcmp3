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
    if (error.name === 'AbortError') throw error;
    console.error("Error fetching songs:", error);
    return [];
  }
};

export const getAllSongs2 = async (page = 0, size = 10, sortBy = 'createdAt', direction = 'desc', signal) => {
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
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
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
    if (error.name === 'AbortError') throw error;
    console.error(`Error fetching song with ID ${id}:`, error);
    throw error;
  }
};

/* ==========================================================
    3) IS CURRENT USER UPLOADER
   - Guest (không token)  → trả về false, KHÔNG gọi API
   - 401 / 403 từ server  → coi như false, KHÔNG throw
========================================================== */
export const isCurrentUserUploader = async (id, signal) => {
  try {
    const baseHeaders = authHeader() || {};
    const hasAuth =
      !!baseHeaders.Authorization || !!baseHeaders.authorization;

    // Nếu không có token → chắc chắn không phải uploader
    if (!hasAuth) {
      return false;
    }

    const res = await fetch(`${API_BASE_URL}/api/songs/${id}/is-uploader`, {
      method: 'GET',
      headers: {
        ...baseHeaders,
        Accept: 'application/json',
      },
      signal,
    });

    // Không đăng nhập / không có quyền → coi như false
    if (res.status === 401 || res.status === 403) {
      return false;
    }

    if (res.status === 404) {
      // Song không tồn tại → cũng coi là false
      return false;
    }

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
    }

    return !!data; // mong đợi boolean true/false
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error(
      `Error checking if current user is uploader for song ID ${id}:`,
      error
    );
    // Đừng ném lỗi nữa, để tránh spam console + UI
    return false;
  }
};


/* ==========================================================
    4) GET SONGS BY ARTIST
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
    if (error.name === 'AbortError') throw error;
    return [];
  }
};

/* ==========================================================
    GET SONGS BY TAG
========================================================== */
export const getSongsByTag = async (tagId, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tags/${tagId}/songs`, {
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
    if (error.name === 'AbortError') throw error;
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
    if (error.name === 'AbortError') throw error;
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
    if (error.name === 'AbortError') throw error;
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
    if (error.name === 'AbortError') throw error;
    console.error("Error fetching TOP liked songs:", error);
    return [];
  }
};

/* ==========================================================
    7) UPLOADED SONGS
========================================================== */
export const getUploadedSongs = async (query = '', signal) => {
  let url = `${API_BASE_URL}/api/songs/uploaded`;
  if (query) {
    url += `?q=${encodeURIComponent(query)}`;
  }

  const res = await fetch(url, {
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
    if (error.name === 'AbortError') throw error;
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
    if (error.name === 'AbortError') throw error;
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
    if (error.name === 'AbortError') throw error;
    console.error(`Error increasing listen count for song with ID ${id}:`, error);
    // Don't re-throw, as this is a background task and shouldn't interrupt user.
  }
};

/* ==========================================================
    DOWNLOAD SONG (NEW)
========================================================== */
export const downloadSong = async (songId, songTitle) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/download`, {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      throw new Error(errorData?.message || `Failed to download song: HTTP ${res.status}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songTitle}.mp3`; // Or use Content-Disposition filename from header
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };

  } catch (error) {
    console.error(`Error downloading song ${songId}:`, error);
    throw error;
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
    if (error.name === 'AbortError') throw error;
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
    if (error.name === 'AbortError') throw error;
    console.error(`Error updating uploaded song ${id}:`, error);
    throw error;
  }
};

/* ==========================================================
    11) UPDATE SONG LYRICS
========================================================== */
export const updateSongLyrics = async (songId, lyrics) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/lyrics`, {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lyrics }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return mapSong(data);
  } catch (error) {
    console.error(`Error updating lyrics for song with ID ${songId}:`, error);
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
    if (error.name === 'AbortError') throw error;
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

export const getSongsByArtistName = async (artistName, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/by-artist?artistName=${artistName}`, {
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
    if (error.name === 'AbortError') throw error;
    return [];
  }
};

export const getSongDetails = async (title, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/details?title=${title}`, {
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
    if (error.name === 'AbortError') throw error;
    console.error(`Error fetching song with title ${title}:`, error);
    throw error;
  }
};

export const getSimilarSongs = async (songId, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/similar`, {
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
    if (error.name === 'AbortError') throw error;
    return [];
  }
};

export const getRecommendedSongs = async (mood, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/recommendations/songs?mood=${mood}`, {
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
    if (error.name === 'AbortError') throw error;
    return [];
  }
};

export const getSimilarSongsByTitle = async (title, signal) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/songs/similar-by-title?title=${title}`, {
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
        if (error.name === 'AbortError') throw error;
        return [];
    }
};
