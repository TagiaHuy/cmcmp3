import React, {
  createContext, useState, useContext, useEffect,
  useCallback, useMemo
} from 'react';
import { useAuth } from './AuthContext'; // 👈 thêm

const MediaPlayerContext = createContext();
export const useMediaPlayer = () => useContext(MediaPlayerContext);

/**
 * Chuẩn hoá artists để tránh lỗi React render object
 */
export function normalizeArtists(artists) {
  if (Array.isArray(artists)) {
    return artists.map(a => a.name).join(', ');
  }
  return artists ?? '';
}

/**
 * Tạo key trong localStorage theo từng user
 * - Nếu chưa đăng nhập → suffix _guest
 * - Nếu có userId → suffix _<userId>
 */
const buildKey = (base, userId) => {
  if (!userId) return `${base}_guest`;
  return `${base}_${userId}`;
};

/**
 * repeatMode: 'none' | 'one' | 'all'
 * queue: [{ id, title, mediaSrc, imageUrl, artists, ... }]
 */
export const MediaPlayerProvider = ({ children }) => {
  const { user } = useAuth();          // 👈 lấy user từ AuthContext
  const userId = user?.id;             // hoặc user?.email nếu bạn muốn

  // ===== Core states =====
  const [currentPlayingSrc, setCurrentPlayingSrc] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [recentlyPlayedPlaylists, setRecentlyPlayedPlaylists] = useState([]);
  const [isSidebarRightVisible, setIsSidebarRightVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaPlayerHeight, setMediaPlayerHeight] = useState(0);

  // ===== Queue & playback mode =====
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [isLyricsVisible, setIsLyricsVisible] = useState(false);
  const [isEditingLyrics, setIsEditingLyrics] = useState(false);

  // --- Init recently played từ localStorage, theo từng user ---
  useEffect(() => {
    try {
      const keyTracks = buildKey('recentlyPlayed', userId);
      const keyPlaylists = buildKey('recentlyPlayedPlaylists', userId);

      const storedTracks =
        JSON.parse(localStorage.getItem(keyTracks)) || [];
      const storedPlaylists =
        JSON.parse(localStorage.getItem(keyPlaylists)) || [];

      setRecentlyPlayed(storedTracks);
      setRecentlyPlayedPlaylists(storedPlaylists);
    } catch {
      setRecentlyPlayed([]);
      setRecentlyPlayedPlaylists([]);
    }
  }, [userId]); // 👈 user đổi → load list khác

  // --- Sync src khi đổi track & cập nhật recentlyPlayed (theo user) ---
  useEffect(() => {
    if (!currentTrack) {
      setCurrentPlayingSrc(null);
      return;
    }
    setCurrentPlayingSrc(currentTrack.mediaSrc || null);

    setRecentlyPlayed(prev => {
      const filtered = (prev || []).filter(p =>
        (p?.id && currentTrack?.id && p.id !== currentTrack.id) ||
        (!p?.id || !currentTrack?.id) &&
        (p?.title !== currentTrack.title || p?.mediaSrc !== currentTrack.mediaSrc)
      );

      const updated = [currentTrack, ...filtered].slice(0, 10);
      const keyTracks = buildKey('recentlyPlayed', userId);
      localStorage.setItem(keyTracks, JSON.stringify(updated));
      return updated;
    });
  }, [currentTrack, userId]); // 👈 phụ thuộc userId

  const addRecentlyPlayedPlaylist = useCallback((playlist) => {
    setRecentlyPlayedPlaylists(prev => {
      const filtered = (prev || []).filter(p => p.id !== playlist.id);
      const updated = [playlist, ...filtered].slice(0, 10);
      const keyPlaylists = buildKey('recentlyPlayedPlaylists', userId);
      localStorage.setItem(keyPlaylists, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

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
    const keyTracks = buildKey('recentlyPlayed', userId);
    localStorage.removeItem(keyTracks);
  }, [userId]);

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

  const toggleLyricsEditor = useCallback(() => {
    setIsEditingLyrics(v => !v);
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

  const turnOffPlayer = useCallback(() => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setQueue([]);
    setCurrentIndex(0);
    setIsSidebarRightVisible(false);
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
    recentlyPlayedPlaylists,
    addRecentlyPlayedPlaylist,
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
    normalizeArtists,
    isLyricsVisible,
    toggleLyrics,
    mediaPlayerHeight,
    setMediaPlayerHeight,
    isEditingLyrics,
    toggleLyricsEditor,
    turnOffPlayer,

  }), [
    queue, currentIndex, currentTrack, currentPlayingSrc,
    isPlaying,
    recentlyPlayed, recentlyPlayedPlaylists, addRecentlyPlayedPlaylist,
    clearRecentlyPlayed, isSidebarRightVisible, toggleSidebarRight,
    isShuffling, repeatMode,
    handlePlay, loadQueue, playPlaylistRandom, playAt,
    prev, next, toggleShuffle, cycleRepeatMode, handleEnded,
    updateSongInQueue,
    currentTime, isLyricsVisible, toggleLyrics, mediaPlayerHeight,
    isEditingLyrics, toggleLyricsEditor, turnOffPlayer
  ]);

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
};
