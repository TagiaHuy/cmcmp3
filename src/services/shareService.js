// src/services/shareService.js
import API_BASE_URL from "../config";

// Fallback: nếu BE không trả gì thì tự build link share
const buildSongFallbackUrl = (songId) =>
  `${window.location.origin}/songs/${songId}`;

const buildPlaylistFallbackUrl = (playlistId) =>
  `${window.location.origin}/playlists/${playlistId}`;

async function extractShareUrl(res) {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const text = await res.text();

  // Không có body -> null
  if (!text) return null;

  // Thử parse JSON trước
  try {
    const data = JSON.parse(text); // { shareUrl: "..." } hoặc "..."
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && data.shareUrl) return data.shareUrl;
    return null;
  } catch {
    // Không phải JSON -> có thể là URL thuần
    return text;
  }
}

const shareService = {
  /* Lấy link chia sẻ bài hát */
  getSongShareUrl: async (songId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/songs/${songId}/share`,
        { method: "GET" }
      );

      const url = await extractShareUrl(res);
      return url || buildSongFallbackUrl(songId);
    } catch (err) {
      console.error("shareService.getSongShareUrl error:", err);
      return null; // để component biết là lỗi thật sự
    }
  },

  /* Lấy link chia sẻ playlist */
  getPlaylistShareUrl: async (playlistId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/playlists/${playlistId}/share`,
        { method: "GET" }
      );

      const url = await extractShareUrl(res);
      return url || buildPlaylistFallbackUrl(playlistId);
    } catch (err) {
      console.error("shareService.getPlaylistShareUrl error:", err);
      return null;
    }
  },
};

export default shareService;
