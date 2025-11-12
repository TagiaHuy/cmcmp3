import { useMediaPlayer } from '../context/MediaPlayerContext';

/**
 * Hook gom toàn bộ action/phím tắt thao tác với MediaPlayerContext.
 * - Trả về state: isShuffling, repeatMode  -> dùng để tô màu icon active
 * - Trả về action: play, playAll, playRandom, prev, next, toggleShuffle, cycleRepeatMode, playAt, favorite
 */
export const useMediaActions = () => {
  const {
    // state cần cho UI
    isShuffling,
    repeatMode,

    // hành động phát
    handlePlay,         // phát 1 bài
    loadQueue,          // nạp playlist & phát từ index
    playPlaylistRandom, // phát ngẫu nhiên một bài trong playlist & bật shuffle
    playAt,             // phát bài theo index trong queue (nếu đã export trong Context)

    // điều hướng
    prev,
    next,

    // chế độ
    toggleShuffle,
    cycleRepeatMode,

    // thư viện (có thể không có)
    addToLibrary,
  } = useMediaPlayer();

  /** Phát 1 bài qua Context (fallback sang Audio() nếu context không có) */
  const play = (payload) => {
    if (typeof handlePlay === 'function') {
      return handlePlay({
        id: payload.id,
        title: payload.title,
        artists: payload.artists,
        imageUrl: payload.imageUrl,
        mediaSrc: payload.mediaSrc, // <- quan trọng
      });
    }
    // Fallback: phát trực tiếp (chỉ nên dùng khi chưa khởi tạo context)
    if (payload?.mediaSrc) {
      if (!window.__audioSingleton) {
        window.__audioSingleton = new Audio();
        window.__audioSingleton.preload = 'auto';
      }
      const audio = window.__audioSingleton;
      audio.pause();
      audio.src = payload.mediaSrc;
      audio.load();
      audio.play().catch((e) => console.warn('Không phát được audio (fallback):', e));
    } else {
      console.warn('Thiếu mediaSrc ở payload:', payload);
    }
  };

  /** Phát cả playlist ngay, bắt đầu từ startIndex (mặc định 0) */
  const playAll = (songs, startIndex = 0) => {
    if (typeof loadQueue === 'function') {
      return loadQueue(songs, startIndex);
    }
    console.warn('loadQueue chưa sẵn sàng trong Context.');
  };

  /** Phát ngẫu nhiên 1 bài trong playlist & bật shuffle */
  const playRandom = (songs) => {
    if (typeof playPlaylistRandom === 'function') {
      return playPlaylistRandom(songs);
    }
    console.warn('playPlaylistRandom chưa sẵn sàng trong Context.');
  };

  /** Phát bài theo index trong queue (tiện cho SidebarRight/Queue) */
  const playIndex = (index) => {
    if (typeof playAt === 'function') {
      return playAt(index);
    }
    console.warn('playAt chưa sẵn sàng trong Context.');
  };

  /** Thêm vào thư viện qua Context (fallback localStorage) */
  const favorite = (item) => {
    if (typeof addToLibrary === 'function') return addToLibrary(item);
    try {
      const key = 'favorites';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!list.find((x) => x.id === item.id)) {
        list.push({ id: item.id, title: item.title, cover: item.imageUrl || item.cover });
        localStorage.setItem(key, JSON.stringify(list));
      }
      console.log('Đã thêm vào thư viện (local):', item.title);
    } catch (e) {
      console.warn('Lỗi lưu favorites local:', e);
    }
  };

  return {
    // state cho UI (để nút đổi màu tím)
    isShuffling,
    repeatMode,

    // hành động phát
    play,
    playAll,
    playRandom,
    playIndex,

    // điều hướng & chế độ
    prev,
    next,
    toggleShuffle,
    cycleRepeatMode,

    // thư viện
    favorite,
  };
};
