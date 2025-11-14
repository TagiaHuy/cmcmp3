import React, {
  createContext, useState, useContext, useEffect,
  useCallback, useMemo
} from 'react';

const MediaPlayerContext = createContext();
export const useMediaPlayer = () => useContext(MediaPlayerContext);

/** 
 * Hàm chuẩn hóa artists để tránh lỗi React render object 
 * - Nếu artists là array → lấy artists.name
 * - Nếu artists là string → giữ nguyên
 */
export function normalizeArtists(artists) {
  if (Array.isArray(artists)) {
    return artists.map(a => a.name).join(', ');
  }
  return artists ?? '';
}

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
  const [queue, setQueue] = useState([]);        
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');

  // --- Init recently played from localStorage ---
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
      setRecentlyPlayed(stored);
    } catch {
      setRecentlyPlayed([]);
    }
  }, []);

  // --- Sync src khi đổi track ---
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

    return list.findIndex(x => 
      x?.title === track.title && x?.mediaSrc === track.mediaSrc
    );
  }, []);

  const randomNextIndex = useCallback((list, cur) => {
    if (list.length <= 1) return cur;
    let idx = cur;
    while (idx === cur) idx = Math.floor(Math.random() * list.length);
    return idx;
  }, []);

  // ===== API phát nhạc =====

  const handlePlay = useCallback((track) => {
    if (!track || !track.mediaSrc) return;

    setQueue(prev => {
      const list = Array.isArray(prev) ? [...prev] : [];
      let idx = findTrackIndex(list, track);

      if (idx === -1) {
        list.push(track);
        idx = list.length - 1;
      }

      setCurrentIndex(idx);
      return list;
    });

    setCurrentTrack(track);

    // Recently played
    setRecentlyPlayed(prev => {
      const filtered = (prev || []).filter(p =>
        (p?.id && track?.id && p.id !== track.id) ||
        (!p?.id || !track?.id) && 
        (p?.title !== track.title || p?.mediaSrc !== track.mediaSrc)
      );

      const updated = [track, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
      return updated;
    });
  }, [findTrackIndex]);

  const clearRecentlyPlayed = useCallback(() => {
    setRecentlyPlayed([]);
    localStorage.removeItem('recentlyPlayed');
  }, []);

  const toggleSidebarRight = useCallback(() => {
    setIsSidebarRightVisible(v => !v);
  }, []);

  const loadQueue = useCallback((songs, startIndex = 0) => {
    const list = Array.isArray(songs) ? songs : [];
    setQueue(list);

    const idx = safeIndex(startIndex, list.length);
    setCurrentIndex(idx);
    setCurrentTrack(list[idx] || null);

  }, [safeIndex]);

  const playPlaylistRandom = useCallback((songs) => {
    const list = Array.isArray(songs) ? songs : [];

    if (!list.length) {
      setQueue([]); 
      setCurrentIndex(0); 
      setCurrentTrack(null);
      return;
    }

    const idx = Math.floor(Math.random() * list.length);
    setQueue(list);
    setCurrentIndex(idx);
    setCurrentTrack(list[idx]);
    setIsShuffling(true);

  }, []);

  const playAt = useCallback((index) => {
    setCurrentIndex(i => {
      const nextI = safeIndex(index, queue.length);
      setCurrentTrack(queue[nextI] || null);
      return nextI;
    });
  }, [queue, safeIndex]);

  const prev = useCallback(() => {
    setCurrentIndex(i => {
      const nextI = safeIndex(i - 1, queue.length);
      setCurrentTrack(queue[nextI] || null);
      return nextI;
    });
  }, [queue, safeIndex]);

  const next = useCallback(() => {
    if (!queue.length) return;

    setCurrentIndex(i => {
      let nextI = i;

      if (isShuffling) {
        nextI = randomNextIndex(queue, i);
      } else {
        const atLast = i === queue.length - 1;

        if (atLast) {
          nextI = (repeatMode === 'all') ? 0 : i;
        } else {
          nextI = i + 1;
        }
      }

      setCurrentTrack(queue[nextI] || null);
      return nextI;
    });

  }, [queue, isShuffling, repeatMode, randomNextIndex]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(s => !s);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(m => 
      (m === 'none' ? 'one' : m === 'one' ? 'all' : 'none')
    );
  }, []);

  const handleEnded = useCallback(() => {
    if (!queue.length) return;
    if (repeatMode === 'one') return;
    if (repeatMode === 'none' && currentIndex === queue.length - 1) return;
    next();
  }, [queue.length, repeatMode, currentIndex, next]);

  // ============================================
  // VALUE xuất ra cho toàn app
  // ============================================

  const value = useMemo(() => ({
    queue,
    currentIndex,
    currentTrack,
    currentPlayingSrc,

    recentlyPlayed,
    clearRecentlyPlayed,
    isSidebarRightVisible,
    toggleSidebarRight,

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

    // thêm vào để dùng ở mọi component
    normalizeArtists

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
