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
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isSidebarRightVisible, setIsSidebarRightVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaPlayerHeight, setMediaPlayerHeight] = useState(0);

  // ===== Queue & playback mode =====
  const [queue, setQueue] = useState([]);        
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [isLyricsVisible, setIsLyricsVisible] = useState(false);

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
    if (!currentTrack) {
      setCurrentPlayingSrc(null);
      return;
    }
    setCurrentPlayingSrc(currentTrack.mediaSrc || null);

    // Update recently played
    setRecentlyPlayed(prev => {
      const filtered = (prev || []).filter(p =>
        (p?.id && currentTrack?.id && p.id !== currentTrack.id) ||
        (!p?.id || !currentTrack?.id) && 
        (p?.title !== currentTrack.title || p?.mediaSrc !== currentTrack.mediaSrc)
      );

      const updated = [currentTrack, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
      return updated;
    });
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
    setIsPlaying(true);
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
    setIsPlaying(true);

  }, [safeIndex]);

  const toggleLyrics = useCallback(() => {
    setIsLyricsVisible(v => !v);
  }, []);

  const playPlaylistRandom = useCallback((songs) => {
    const list = Array.isArray(songs) ? songs : [];

    if (!list.length) {
      setQueue([]); 
      setCurrentIndex(0); 
      setCurrentTrack(null);
      setIsPlaying(false);
      return;
    }

    const idx = Math.floor(Math.random() * list.length);
    setQueue(list);
    setCurrentIndex(idx);
    setCurrentTrack(list[idx]);
    setIsShuffling(true);
    setIsPlaying(true);

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
    if (repeatMode === 'none' && currentIndex === queue.length - 1) {
      setIsPlaying(false);
      return;
    }
    next();
  }, [queue.length, repeatMode, currentIndex, next]);

  const updateSongInQueue = useCallback((songId, update) => {
    setQueue(prevQueue =>
      prevQueue.map(song =>
        song.id === songId ? { ...song, ...update } : song
      )
    );
    setCurrentTrack(prevTrack =>
      prevTrack && prevTrack.id === songId ? { ...prevTrack, ...update } : prevTrack
    );
  }, []);

  // ============================================
  // VALUE xuất ra cho toàn app
  // ============================================

  const value = useMemo(() => ({
    queue,
    currentIndex,
    currentTrack,
    currentPlayingSrc,
    isPlaying,
    setIsPlaying,

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
    updateSongInQueue,

    currentTime,
    setCurrentTime,
    // thêm vào để dùng ở mọi component
    normalizeArtists,
    isLyricsVisible,
    toggleLyrics,
    mediaPlayerHeight,
    setMediaPlayerHeight,

  }), [
    queue, currentIndex, currentTrack, currentPlayingSrc,
    isPlaying, setIsPlaying,
    recentlyPlayed, isSidebarRightVisible,
    isShuffling, repeatMode,
    handlePlay, loadQueue, playPlaylistRandom, playAt,
    prev, next, toggleShuffle, cycleRepeatMode, handleEnded,
    clearRecentlyPlayed, toggleSidebarRight, updateSongInQueue,
    currentTime, isLyricsVisible, toggleLyrics, mediaPlayerHeight
  ]);

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
};
