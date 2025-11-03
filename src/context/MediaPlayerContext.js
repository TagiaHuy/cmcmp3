import React, { createContext, useState, useContext, useEffect } from 'react';

const MediaPlayerContext = createContext();

export const useMediaPlayer = () => {
  return useContext(MediaPlayerContext);
};

export const MediaPlayerProvider = ({ children }) => {
  const [currentPlayingSrc, setCurrentPlayingSrc] = useState(null);
  const [mediaPlayerKey, setMediaPlayerKey] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    try {
      const storedRecentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
      setRecentlyPlayed(storedRecentlyPlayed);
    } catch (error) {
      console.error("Failed to parse recentlyPlayed from localStorage", error);
      setRecentlyPlayed([]);
    }
  }, []);

  const handlePlay = (playlist) => {
    if (playlist && playlist.mediaSrc) {
      setCurrentPlayingSrc(playlist.mediaSrc);
      setMediaPlayerKey(prevKey => prevKey + 1);
      
      setRecentlyPlayed(prevPlayed => {
        const updatedRecentlyPlayed = [playlist, ...prevPlayed.filter(p => p.title !== playlist.title)];
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

  const value = {
    currentPlayingSrc,
    mediaPlayerKey,
    handlePlay,
    recentlyPlayed,
    clearRecentlyPlayed,
  };

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
};
