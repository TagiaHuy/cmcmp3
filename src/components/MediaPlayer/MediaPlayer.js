import React, { useRef, useState, useEffect, useContext } from 'react';
import { Box, IconButton, Slider, Typography, Stack, Paper, Menu } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import MicIcon from '@mui/icons-material/Mic';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { normalizeArtists } from '../../context/MediaPlayerContext'; // ✅ NEW: fix render object artists
import { useMediaActions } from '../../hooks/useMediaActions';
import { ThemeContext } from '../../theme/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';

import { increaseListenCount, updateSongLyrics } from '../../services/songService';

import PlaybackControls from '../Button/Specific/PlaybackControls';
import CurrentSongCard from '../Card/CurrentSongCard';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import SeekHandle from './SeekHandle';
import LyricsModal from '../Lyric/LyricsModal';
import DownloadMenuItem from '../MenuItem/Specific/DownloadMenuItem';
import ShareMenu from '../MenuItem/Specific/ShareMenu';

import cmcmp3Logo from '../../assets/cmcmp3-logo.png';

const MediaPlayer = () => {
  const {
    currentPlayingSrc,
    currentTrack,
    isPlaying,
    setIsPlaying,
    isSidebarRightVisible,
    toggleSidebarRight,
    handleEnded,
    currentTime,
    setCurrentTime,
    toggleLyrics,
    setMediaPlayerHeight,
    updateSongInQueue,
    isEditingLyrics,
    turnOffPlayer,
    seekTargetTime,
    setSeekTargetTime,
  } = useMediaPlayer();

  const { currentTheme } = useContext(ThemeContext);
  const { notifySuccess, notifyError } = useNotifications();

  const {
    prev,
    next,
    isShuffling,
    repeatMode,
    toggleShuffle,
    cycleRepeatMode,
  } = useMediaActions();

  const audioRef = useRef(null);
  const playerRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem('cmcmp3-volume');
    return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
  });

  useEffect(() => {
    if (playerRef.current) {
      setMediaPlayerHeight(playerRef.current.clientHeight);
    }
  }, [setMediaPlayerHeight]);

  // handle external seek
  useEffect(() => {
    if (seekTargetTime !== null && isFinite(seekTargetTime) && audioRef.current) {
      audioRef.current.currentTime = seekTargetTime;
      setCurrentTime(seekTargetTime);
      setSeekTargetTime(null);
    }
  }, [seekTargetTime, setSeekTargetTime, setCurrentTime]);

  // persist volume
  useEffect(() => {
    localStorage.setItem('cmcmp3-volume', volume);
  }, [volume]);

  // load metadata & bind events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [setIsPlaying, setCurrentTime]);

  // sync playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentPlayingSrc, setIsPlaying]);

  // sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // listen count session
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || !duration) return;

    const songId = currentTrack.id;
    const listenSessionKey = `cmcmp3-listen-session-${songId}`;

    const startListenSession = () => {
      const now = Date.now();
      const session = {
        songId,
        startTime: now,
        countedTime: now + 30 * 1000,
        endTime: now + duration * 1000,
        counted: false,
      };
      localStorage.setItem(listenSessionKey, JSON.stringify(session));
      return session;
    };

    let sessionJSON = localStorage.getItem(listenSessionKey);
    let session = sessionJSON ? JSON.parse(sessionJSON) : null;

    if (!session || Date.now() > session.endTime) {
      session = startListenSession();
    }

    const handleTimeUpdate = () => {
      const currentSessionJSON = localStorage.getItem(listenSessionKey);
      if (!currentSessionJSON) return;

      const currentSession = JSON.parse(currentSessionJSON);

      if (Date.now() > currentSession.countedTime && !currentSession.counted) {
        increaseListenCount(songId);
        currentSession.counted = true;
        localStorage.setItem(listenSessionKey, JSON.stringify(currentSession));
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);

      const finalSessionJSON = localStorage.getItem(listenSessionKey);
      if (finalSessionJSON) {
        const finalSession = JSON.parse(finalSessionJSON);
        if (!finalSession.counted) {
          localStorage.removeItem(listenSessionKey);
        }
      }
    };
  }, [currentTrack, duration]);

  const handlePlayPause = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
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

  const handleLyricsParsed = async (newLyrics) => {
    if (!currentTrack) {
      notifyError('No track selected to save lyrics for.');
      return;
    }
    try {
      const updatedSong = await updateSongLyrics(currentTrack.id, newLyrics);
      updateSongInQueue(currentTrack.id, { lyrics: updatedSong.lyrics });
      notifySuccess('Lyrics have been saved successfully!');
    } catch (error) {
      console.error('Failed to save lyrics:', error);
      notifyError('Failed to save lyrics. Please try again.');
    }
  };

  const format = (t) => {
    if (!Number.isFinite(t) || t <= 0) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const textColor = currentTheme === 'dark' ? '#eee' : '#222';

  if (!currentTrack) return null;

  // ✅ NEW: artists string (fix crash)
  const authorText =
    normalizeArtists(currentTrack?.artists ?? currentTrack?.artist) || 'Unknown';

  return (
    <>
      <LyricsModal
        isEditingLyrics={isEditingLyrics}
        onLyricsParsed={handleLyricsParsed}
        duration={duration}
      />

      <Paper
        ref={playerRef}
        elevation={6}
        sx={{
          width: '100%',
          px: 3,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(14px)',
          background: currentTheme === 'dark'
            ? 'rgba(20, 20, 20, 0.65)'
            : 'rgba(255, 255, 255, 0.65)',
          borderTop: currentTheme === 'dark' ? '1px solid #333' : '1px solid #ddd',
          transition: '0.3s ease',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.modal + 21,
        }}
      >
        <Box sx={{ width: '100%', display: 'flex' }}>
          {/* LEFT */}
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
              songAuthor={authorText} // ✅ FIXED
            />

            <FavoriteButton songId={currentTrack?.id} isFavorite={currentTrack?.isFavorite} />
            <MoreButton onClick={handleMenuOpen} />

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{ 'aria-labelledby': 'more-button-media-player' }}
            >
              <DownloadMenuItem
                songId={currentTrack?.id}
                songTitle={currentTrack?.title}
                onCloseMenu={handleMenuClose}
              />
              <ShareMenu
                anchorEl={anchorEl}
                open={open}
                onCloseMenu={handleMenuClose}
                type="song"
                id={currentTrack?.id}
              />
            </Menu>
          </Box>

          {/* CENTER */}
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

            <audio
              ref={audioRef}
              src={currentPlayingSrc || undefined}
              preload="metadata"
              onEnded={onEnded}
            />

            <SeekHandle
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              textColor={textColor}
              format={format}
            />
          </Stack>

          {/* RIGHT */}
          <Box
            sx={{
              width: '25%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1.8,
              marginRight: 6,
            }}
          >
            <IconButton onClick={toggleLyrics} sx={{ color: textColor }}>
              <MicIcon />
            </IconButton>

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
              {isSidebarRightVisible ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
            </IconButton>

            <IconButton onClick={turnOffPlayer} sx={{ color: textColor }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(6px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </Box>
      </Paper>
    </>
  );
};

export default MediaPlayer;
