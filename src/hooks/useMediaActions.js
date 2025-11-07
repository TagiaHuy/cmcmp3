import { useMediaPlayer } from "../context/MediaPlayerContext";

export const useMediaActions = () => {
  const { handlePlay, addToLibrary } = useMediaPlayer();

  const playViaContextOrFallback = (payload) => {
    // Ưu tiên context
    if (typeof handlePlay === "function") {
      return handlePlay({
        title: payload.title,
        artists: payload.artists,
        imageUrl: payload.imageUrl,
        audioUrl: payload.mediaSrc, // map sang field audioUrl cho player hiện có
        mediaSrc: payload.mediaSrc,
      });
    }
    // Fallback: phát trực tiếp
    if (payload?.mediaSrc) {
      if (!window.__audioSingleton) {
        window.__audioSingleton = new Audio();
        window.__audioSingleton.preload = "auto";
      }
      const audio = window.__audioSingleton;
      audio.pause();
      audio.src = payload.mediaSrc;
      audio.load();
      audio.play().catch((e) => console.warn("Không phát được audio:", e));
    } else {
      console.warn("Thiếu mediaSrc:", payload);
    }
  };

  const favoriteViaContextOrLocal = (item) => {
    if (typeof addToLibrary === "function") return addToLibrary(item);
    try {
      const key = "favorites";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      if (!list.find((x) => x.id === item.id)) {
        list.push({ id: item.id, title: item.title, cover: item.cover });
        localStorage.setItem(key, JSON.stringify(list));
      }
      console.log("Đã thêm vào thư viện (local):", item.title);
    } catch (e) {
      console.warn("Lỗi lưu favorites local:", e);
    }
  };

  return {
    play: playViaContextOrFallback,
    favorite: favoriteViaContextOrLocal,
  };
};