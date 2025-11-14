import React, { useRef, useState, useEffect, useContext } from 'react';
import { Box, IconButton, Slider, Typography, Stack, Paper } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { useMediaActions } from '../../hooks/useMediaActions';
import { ThemeContext } from '../../theme/ThemeContext';

import PlaybackControls from '../Button/Specific/PlaybackControls';
import CurrentSongCard from '../Card/CurrentSongCard';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';

import cmcmp3Logo from '../../assets/cmcmp3-logo.png';

const MediaPlayer = () => {
  const {
    currentPlayingSrc,
    currentTrack,
    isSidebarRightVisible,
    toggleSidebarRight,
    handleEnded,
  } = useMediaPlayer();

  const { currentTheme } = useContext(ThemeContext);

  const {
    prev,
    next,
    isShuffling,
    repeatMode,
    toggleShuffle,
    cycleRepeatMode,
  } = useMediaActions();

  const audioRef = useRef(null);

  // UI STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // LOAD METADATA
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentPlayingSrc) return;

    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrentTime(audio.currentTime || 0);

      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime || 0));
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [currentPlayingSrc]);

  // SYNC VOLUME
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
  };

  const handleSeek = (_e, v) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = v;
    setCurrentTime(v);
  };

  const toggleMute = () => setVolume((v) => (v === 0 ? 0.5 : 0));

  const onEnded = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    handleEnded();
  };

  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeCurrent = Math.min(Number.isFinite(currentTime) ? currentTime : 0, safeDuration);

  const format = (t) => {
    if (!Number.isFinite(t) || t <= 0) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const textColor = currentTheme === 'dark' ? '#eee' : '#222';

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        px: 3,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(14px)',
        background: currentTheme === 'dark'
          ? 'rgba(20, 20, 20, 0.65)'
          : 'rgba(255, 255, 255, 0.65)',
        borderTop: currentTheme === 'dark' ? '1px solid #333' : '1px solid #ddd',
        transition: '0.3s ease',
      }}
    >
      {/* LEFT SECTION — Song Info */}
      <Box
        sx={{
          width: '25%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.8,
          opacity: 0,
          animation: 'fadeIn 0.6s ease forwards',
        }}
      >
        <CurrentSongCard
          songImage={currentTrack?.imageUrl || cmcmp3Logo}
          songTitle={currentTrack?.title || 'No song playing'}
          songAuthor={currentTrack?.artists || 'Unknown'}
        />
        <FavoriteButton />
        <MoreButton />
      </Box>

      {/* CENTER SECTION — Controls */}
      <Stack
        sx={{
          flexGrow: 1,
          alignItems: 'center',
          px: 2,
          opacity: 0,
          animation: 'fadeIn 0.8s ease forwards',
        }}
      >
        <PlaybackControls
          isPlaying={isPlaying}
          repeatMode={repeatMode}
          isShuffleActive={isShuffling}
          handlePlayPause={handlePlayPause}
          handlePrevious={prev}
          handleNext={next}
          handleShuffle={toggleShuffle}
          handleRepeat={cycleRepeatMode}
        />

        {/* Progress Bar */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <audio
            ref={audioRef}
            src={currentPlayingSrc || undefined}
            preload="metadata"
            onEnded={onEnded}
          />

          <Typography variant="body2" sx={{ color: textColor, width: 40 }}>
            {format(safeCurrent)}
          </Typography>

          <Slider
            value={safeCurrent}
            min={0}
            max={safeDuration}
            step={1}
            onChange={handleSeek}
            sx={{
              color: '#9353FF',
              flexGrow: 1,
              '& .MuiSlider-track': { border: 'none' },
              '& .MuiSlider-thumb': {
                width: 14,
                height: 14,
                backgroundColor: '#fff',
                border: '2px solid #9353FF',
                '&:hover': { boxShadow: '0 0 0 8px rgba(147, 83, 255, 0.16)' },
              },
            }}
          />

          <Typography variant="body2" sx={{ color: textColor, width: 40, textAlign: 'right' }}>
            {format(safeDuration)}
          </Typography>
        </Stack>
      </Stack>

      {/* RIGHT SECTION — Volume + Playlist */}
      <Box
        sx={{
          width: '25%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1.8,
          marginRight: 6
        }}
      >
        <IconButton onClick={toggleMute} sx={{ color: textColor }}>
          {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>

        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={(_e, v) => setVolume(v)}
          sx={{
            width: 110,
            color: '#9353FF',
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
              backgroundColor: '#fff',
              border: '2px solid #9353FF',
              '&:hover': { boxShadow: '0 0 0 8px rgba(147, 83, 255, 0.16)' },
            },
          }}
        />

        <IconButton
          onClick={toggleSidebarRight}
          sx={{
            color: isSidebarRightVisible ? '#9353FF' : textColor,
            transition: '0.2s',
          }}
        >
          <QueueMusicIcon />
        </IconButton>
      </Box>

      {/* Fade-in Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Paper>
  );
};

export default MediaPlayer;
