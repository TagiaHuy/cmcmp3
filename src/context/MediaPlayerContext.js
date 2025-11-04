import React, { createContext, useState, useContext, useEffect } from 'react';

const MediaPlayerContext = createContext();

export const useMediaPlayer = () => {
  return useContext(MediaPlayerContext);
};

export const MediaPlayerProvider = ({ children }) => {
  const [currentPlayingSrc, setCurrentPlayingSrc] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null); // <--- Thêm state cho track hiện tại
  const [mediaPlayerKey, setMediaPlayerKey] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isSidebarRightVisible, setIsSidebarRightVisible] = useState(true);

  useEffect(() => {
    try {
      const storedRecentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
      setRecentlyPlayed(storedRecentlyPlayed);
    } catch (error) {
      console.error("Failed to parse recentlyPlayed from localStorage", error);
      setRecentlyPlayed([]);
    }
  }, []);

  const handlePlay = (track) => { // đổi tên playlist thành track cho rõ nghĩa
    if (track && track.mediaSrc) {
      setCurrentPlayingSrc(track.mediaSrc);
      setCurrentTrack(track); // <--- Lưu cả object track
      setMediaPlayerKey(prevKey => prevKey + 1);
      
      setRecentlyPlayed(prevPlayed => {
        const updatedRecentlyPlayed = [track, ...prevPlayed.filter(p => p.title !== track.title)];
        if (updatedRecentlyPlayed.length > 10) {
          updatedRecentlyPlayed.length = 10;
        }
        localStorage.setItem('recentlyPlayed', JSON.stringify(updatedRecentlyPlayed));
        return updatedRecentlyPlayed;
      });
    }
  };

  const clearRecentlyPlayed = () => {
    setRecentlyPlayed([]);
    localStorage.removeItem('recentlyPlayed');
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightVisible(prevState => !prevState);
  };

  const value = {
    currentPlayingSrc,
    currentTrack, // <--- Expose track hiện tại
    mediaPlayerKey,
    handlePlay,
    recentlyPlayed,
    clearRecentlyPlayed,
    isSidebarRightVisible,
    toggleSidebarRight,
  };

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
};
