import React, { createContext, useState, useContext } from 'react';

const MediaPlayerContext = createContext();

export const useMediaPlayer = () => {
  return useContext(MediaPlayerContext);
};

export const MediaPlayerProvider = ({ children }) => {
  const [currentPlayingSrc, setCurrentPlayingSrc] = useState(null);
  const [mediaPlayerKey, setMediaPlayerKey] = useState(0); // Key to force MediaPlayer remount

  const handlePlay = (src) => {
    setCurrentPlayingSrc(src);
    setMediaPlayerKey(prevKey => prevKey + 1); // Increment key to force MediaPlayer remount
  };

  const value = {
    currentPlayingSrc,
    mediaPlayerKey,
    handlePlay,
  };

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
};
