import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Stack } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { useMediaActions } from '../../hooks/useMediaActions';

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
    handleEnded,        // context xử lý next/prev theo repeat/shuffle
  } = useMediaPlayer();

  const {
    prev,
    next,
    isShuffling,
    repeatMode,
    toggleShuffle,
    cycleRepeatMode,
  } = useMediaActions();

  const audioRef = useRef(null);

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Khi đổi src → load lại metadata
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentPlayingSrc) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrentTime(audio.currentTime || 0);

      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [currentPlayingSrc]);

  // Đồng bộ volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Play/pause
  const handlePlayPause = () => {
    const a = audioRef.current;
    if (!a) return;
    a.paused ? a.play() : a.pause();
  };

  // Seek
  const handleSeek = (_e, v) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = v;
    setCurrentTime(v);
  };

  // Mute
  const toggleMute = () => {
    setVolume((v) => (v === 0 ? 0.5 : 0));
  };

  // Khi bài hát kết thúc
  const onEnded = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    handleEnded(); // chuyển bài theo context
  };

  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeCurrent = Math.min(
    Number.isFinite(currentTime) ? currentTime : 0,
    safeDuration
  );

  const format = (t) => {
    if (!Number.isFinite(t) || t <= 0) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Box
      sx={{
        width: '100%',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* LEFT */}
      <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <CurrentSongCard
          songImage={currentTrack?.imageUrl || cmcmp3Logo}
          songTitle={currentTrack?.title || 'No song playing'}
          songAuthor={currentTrack?.artists || 'Unknown'}
        />
        <FavoriteButton />
        <MoreButton />
      </Box>

      {/* CENTER */}
      <Stack sx={{ flexGrow: 1, alignItems: 'center', px: 2 }}>
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

        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          
          <audio
            ref={audioRef}
            src={currentPlayingSrc || undefined}
            preload="metadata"
            onEnded={onEnded}
          />

          <Typography variant="body2">
            {format(safeCurrent)}
          </Typography>

          <Slider
            value={safeCurrent}
            min={0}
            max={safeDuration}
            step={1}
            onChange={handleSeek}
          />

          <Typography variant="body2">
            {format(safeDuration)}
          </Typography>
        </Stack>
      </Stack>

      {/* RIGHT */}
      <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 3 }}>
        <IconButton onClick={toggleMute}>
          {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>

        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={(_e, v) => setVolume(v)}
          sx={{ width: 100 }}
        />

        <IconButton
          onClick={toggleSidebarRight}
          color={isSidebarRightVisible ? 'primary' : 'default'}
        >
          <QueueMusicIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MediaPlayer;
