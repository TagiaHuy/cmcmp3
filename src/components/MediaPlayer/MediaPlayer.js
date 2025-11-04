import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Stack } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import QueueMusicIcon from '@mui/icons-material/QueueMusic'; // Import the icon
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import PlaybackControls from '../Button/Specific/PlaybackControls';
import CurrentSongCard from '../Card/CurrentSongCard';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import cmcmp3Logo from '../../assets/cmcmp3-logo.png';

const MediaPlayer = () => {
  const { currentPlayingSrc, mediaPlayerKey, isSidebarRightVisible, toggleSidebarRight } = useMediaPlayer();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentPlayingSrc) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
      audio.play(); // Autoplay when new source is loaded
      setIsPlaying(true); // Set playing state to true
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const togglePlay = () => setIsPlaying(!audio.paused);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', togglePlay);
    audio.addEventListener('pause', togglePlay);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', togglePlay);
      audio.removeEventListener('pause', togglePlay);
    };
  }, [currentPlayingSrc, mediaPlayerKey]); // Depend on currentPlayingSrc and mediaPlayerKey

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event, newValue) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handlePrevious = () => {
    console.log('Previous track');
    // Implement logic for previous track
  };

  const handleNext = () => {
    console.log('Next track');
    // Implement logic for next track
  };

  const handleShuffle = () => {
    setIsShuffleActive(!isShuffleActive);
    console.log('Shuffle toggled', !isShuffleActive);
  };

  const handleRepeat = () => {
    setIsRepeatActive(!isRepeatActive);
    console.log('Repeat toggled', !isRepeatActive);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box sx={{
      width: '100%',
      p: 2,
      bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.body.background : 'background.paper',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // Use space-between
      minHeight: 10
    }}>
      {/* Left Section with fixed width */}
      <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <CurrentSongCard
          songImage={cmcmp3Logo}
          songTitle="cmcmp3"
          songAuthor="this is a song"
        />
        <FavoriteButton />
        <MoreButton />
      </Box>

      {/* Middle Section that grows */}
      <Stack sx={{ flexGrow: 1, alignItems: 'center', px: 2 }}>
        <PlaybackControls
          isPlaying={isPlaying}
          isShuffleActive={isShuffleActive}
          isRepeatActive={isRepeatActive}
          handlePlayPause={handlePlayPause}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          handleShuffle={handleShuffle}
          handleRepeat={handleRepeat}
        />
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <audio ref={audioRef} src={currentPlayingSrc} preload="metadata" />
          <Typography variant="body2">{formatTime(currentTime)}</Typography>
          <Slider
            aria-label="time-indicator"
            size="small"
            value={currentTime}
            min={0}
            step={1}
            max={duration}
            onChange={handleSeek}
            sx={{
              color: 'text.primary',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 8,
                height: 8,
                transition: '0.3s cubic-bezier(.47,1.64,.43,.85)',
                '&::before': {
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                },
                '&.Mui-active': {
                  width: 20,
                  height: 20,
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
          <Typography variant="body2">{formatTime(duration)}</Typography>
        </Stack>
      </Stack>

      {/* Right Section with fixed width */}
      <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
          {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <Slider
          aria-label="Volume"
          size="small"
          value={volume}
          min={0}
          step={0.01}
          max={1}
          onChange={handleVolumeChange}
          sx={{
            color: 'text.primary',
            width: 100,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.43,.85)',
              '&::before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MediaPlayer;
