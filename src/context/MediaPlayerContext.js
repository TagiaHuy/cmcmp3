import React, {
  createContext, useState, useContext, useEffect,
  useCallback, useMemo
} from 'react';

const MediaPlayerContext = createContext();
export const useMediaPlayer = () => useContext(MediaPlayerContext);

/**
 * repeatMode: 'none' | 'one' | 'all'
 * queue: [{ id, title, mediaSrc, imageUrl, artists, ... }]
 */
export const MediaPlayerProvider = ({ children }) => {
  // ===== Core states =====
  const [currentPlayingSrc, setCurrentPlayingSrc] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isSidebarRightVisible, setIsSidebarRightVisible] = useState(true);

  // ===== Queue & playback mode =====
  const [queue, setQueue] = useState([]);        // danh sách đang phát
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'one' | 'all'

  // --- Init recently played from localStorage ---
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
      setRecentlyPlayed(stored);
    } catch {
      setRecentlyPlayed([]);
    }
  }, []);

  // --- Sync src khi đổi track (KHÔNG tăng key, KHÔNG remount) ---
  useEffect(() => {
    setCurrentPlayingSrc(currentTrack?.mediaSrc || null);
  }, [currentTrack]);

  // ===== Helpers =====
  const safeIndex = useCallback((i, len) => {
    if (!len) return 0;
    return ((i % len) + len) % len;
  }, []);

  const findTrackIndex = useCallback((list, track) => {
    if (!track) return -1;
    const byId = list.findIndex(x => x?.id && x.id === track.id);
    if (byId !== -1) return byId;
    return list.findIndex(x => x?.title === track.title && x?.mediaSrc === track.mediaSrc);
  }, []);

  const randomNextIndex = useCallback((list, cur) => {
    if (list.length <= 1) return cur;
    let idx = cur;
    while (idx === cur) idx = Math.floor(Math.random() * list.length);
    return idx;
  }, []);

  // ===== API phát nhạc =====

  /** Phát 1 bài lẻ (không thay queue nếu đã có bài trong queue) */
  const handlePlay = useCallback((track) => {
    if (!track || !track.mediaSrc) return;

    setQueue(prev => {
      const list = Array.isArray(prev) ? [...prev] : [];
      let idx = findTrackIndex(list, track);
      if (idx === -1) {
        list.push(track);       // thêm vào cuối
        idx = list.length - 1;
      }
      setCurrentIndex(idx);
      return list;
    });

    setCurrentTrack(track);

    // Recently played (unique + limit 10)
    setRecentlyPlayed(prev => {
      const filtered = (prev || []).filter(p =>
        (p?.id && track?.id && p.id !== track.id) ||
        (!p?.id || !track?.id) && (p?.title !== track.title || p?.mediaSrc !== track.mediaSrc)
      );
      const updated = [track, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
      return updated;
    });
  }, [findTrackIndex]);

  /** Xóa Recently Played */
  const clearRecentlyPlayed = useCallback(() => {
    setRecentlyPlayed([]);
    localStorage.removeItem('recentlyPlayed');
  }, []);

  /** Toggle Sidebar phải */
  const toggleSidebarRight = useCallback(() => {
    setIsSidebarRightVisible(v => !v);
  }, []);

  /** Nạp playlist và phát từ index chỉ định */
  const loadQueue = useCallback((songs, startIndex = 0) => {
    const list = Array.isArray(songs) ? songs : [];
    setQueue(list);
    const idx = safeIndex(startIndex, list.length);
    setCurrentIndex(idx);
    setCurrentTrack(list[idx] || null);
  }, [safeIndex]);

  /** Phát ngẫu nhiên 1 bài trong playlist & bật shuffle (KHÔNG reset bài nếu đã phát) */
  const playPlaylistRandom = useCallback((songs) => {
    const list = Array.isArray(songs) ? songs : [];
    if (!list.length) {
      setQueue([]); setCurrentIndex(0); setCurrentTrack(null);
      return;
    }
    const idx = Math.floor(Math.random() * list.length);
    setQueue(list);
    setCurrentIndex(idx);
    setCurrentTrack(list[idx]);
    setIsShuffling(true);        // chỉ đổi cờ
  }, []);

  /** Phát bài ở vị trí index trong queue (tiện cho sidebar queue) */
  const playAt = useCallback((index) => {
    setCurrentIndex(i => {
      const nextI = safeIndex(index, queue.length);
      setCurrentTrack(queue[nextI] || null);
      return nextI;
    });
  }, [queue, safeIndex]);

  /** Bài trước */
  const prev = useCallback(() => {
    setCurrentIndex(i => {
      const nextI = safeIndex(i - 1, queue.length);
      setCurrentTrack(queue[nextI] || null);
      return nextI;
    });
  }, [queue, safeIndex]);

  /** Bài sau */
  const next = useCallback(() => {
    if (!queue.length) return;
    setCurrentIndex(i => {
      let nextI = i;
      if (isShuffling) {
        nextI = randomNextIndex(queue, i);
      } else {
        const atLast = i === queue.length - 1;
        if (atLast) nextI = (repeatMode === 'all') ? 0 : i;
        else nextI = i + 1;
      }
      setCurrentTrack(queue[nextI] || null);
      return nextI;
    });
  }, [queue, isShuffling, repeatMode, randomNextIndex]);

  /** Bật/tắt shuffle — chỉ đổi cờ, KHÔNG đổi bài hiện tại */
  const toggleShuffle = useCallback(() => {
    setIsShuffling(s => !s);
  }, []);

  /** Đổi repeat: none → one → all → none — chỉ đổi cờ */
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(m => (m === 'none' ? 'one' : m === 'one' ? 'all' : 'none'));
  }, []);

  /** Gọi khi <audio> kết thúc */
  const handleEnded = useCallback(() => {
    if (!queue.length) return;
    if (repeatMode === 'one') return; // MediaPlayer tự tua 0 & play lại
    if (repeatMode === 'none' && currentIndex === queue.length - 1) return;
    next();
  }, [queue.length, repeatMode, currentIndex, next]);

  const value = useMemo(() => ({
    // data
    queue,
    currentIndex,
    currentTrack,
    currentPlayingSrc,

    // recently played & sidebar
    recentlyPlayed,
    clearRecentlyPlayed,
    isSidebarRightVisible,
    toggleSidebarRight,

    // controls
    isShuffling,
    repeatMode,
    handlePlay,
    loadQueue,
    playPlaylistRandom,
    playAt,
    prev,
    next,
    toggleShuffle,
    cycleRepeatMode,
    handleEnded,
  }), [
    queue, currentIndex, currentTrack, currentPlayingSrc,
    recentlyPlayed, isSidebarRightVisible,
    isShuffling, repeatMode,
    handlePlay, loadQueue, playPlaylistRandom, playAt,
    prev, next, toggleShuffle, cycleRepeatMode, handleEnded,
    clearRecentlyPlayed, toggleSidebarRight
  ]);

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
};
