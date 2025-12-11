// src/services/recommendationService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';
import { getAllSongs, getTopSongs } from './songService';

// Fallback: Lấy 10 bài hát nghe nhiều nhất
const getFallbackRecommendations = async (signal) => {
  console.log("Người dùng chưa đăng nhập hoặc không có lịch sử, gợi ý bài hát nổi bật.");
  return await getTopSongs(10, signal);
};

// Chuẩn hóa song trả về FE
const normalizeArtists = (artists) => {
    if (!artists) return "Không rõ";
    if (typeof artists === "string") return artists;
    if (Array.isArray(artists)) return artists.map(a => a.name || a).join(", ");
    if (typeof artists === "object") return artists.name || JSON.stringify(artists);
    return String(artists);
  };
  
  const toArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  };
  
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
      tags: normalizeTags(song.tags), 
      mediaSrc: song.filePath,
    };
  };

/**
 * Gợi ý bài hát cho người dùng đã đăng nhập.
 * - Dựa trên lịch sử nghe (cùng nghệ sĩ, thể loại).
 * - Nếu không có lịch sử, gợi ý 10 bài hát nghe nhiều nhất.
 * Yêu cầu JWT token.
 * @param {AbortSignal} signal - AbortSignal để hủy request.
 * @returns {Promise<Array<Object>>} - Mảng các bài hát được gợi ý.
 */
export const getRecommendationsForMe = async (signal) => {
  const headers = authHeader();
  
  // Nếu không có token, không gọi API /for-me
  if (!headers.Authorization || headers.Authorization === 'Bearer undefined') {
    return getFallbackRecommendations(signal);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/recommendations/for-me`, {
      method: "GET",
      headers: {
        ...headers,
        Accept: "application/json",
      },
      signal,
    });

    // Nếu API trả về 401 hoặc lỗi khác, cũng dùng fallback
    if (!res.ok) {
        if(res.status === 401) {
            console.log("Token không hợp lệ hoặc đã hết hạn, dùng fallback.");
        } else {
            console.warn(`API /for-me trả về lỗi ${res.status}, dùng fallback.`);
        }
        return getFallbackRecommendations(signal);
    }
    
    const data = await safeJson(res);

    // Nếu API trả về mảng rỗng (người dùng mới), dùng fallback
    if (!data || data.length === 0) {
        console.log("Không có gợi ý cá nhân, dùng fallback.");
        return getFallbackRecommendations(signal);
    }

    // Map lại dữ liệu trả về để nhất quán với cấu trúc của app
    return (Array.isArray(data) ? data : []).map(mapSong);

  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Ném lại lỗi AbortError để hook có thể xử lý
    }
    console.error("Lỗi khi lấy gợi ý cá nhân, dùng fallback:", error);
    return getFallbackRecommendations(signal);
  }
};
