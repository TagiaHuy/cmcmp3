import React from 'react';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Avatar,
  ListItem,
  ListItemAvatar,
  Paper
} from '@mui/material';

import FavoriteButton from '../../Button/Specific/FavoriteButton';
import MoreButton from '../../Button/Specific/MoreButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

const ACTION_WIDTH = 96;

const NowPlaying = () => {
  const { currentTrack, handlePlay, normalizeArtists } = useMediaPlayer();
  const theme = useTheme();

  if (!currentTrack) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 800,
          mb: 1.5,
          color: theme.palette.text.primary,
        }}
      >
        Đang phát
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: 2,
          background: 'rgba(155, 77, 224, 0.28)',
          border: '1px solid rgba(155,77,224,0.55)',
        }}
      >
        <ListItem
          disableGutters
          sx={{
            position: 'relative',
            borderRadius: 2,
            pr: 1,
            transition: 'background .15s ease, padding-right .15s ease',
            '&:hover': {
              background: 'rgba(155, 77, 224, 0.35)',
              pr: `${ACTION_WIDTH}px`,
            },
            '&:hover .thumb-play': {
              transform: 'translate(-50%, -50%) scale(1.35)',
              filter: 'drop-shadow(0 0 14px rgba(155,77,224,1))',
            },
            '&:hover .song-text': { maxWidth: `calc(100% - ${ACTION_WIDTH}px)` },
            '&:hover .song-actions': { opacity: 1, visibility: 'visible' },
          }}
        >
          <ListItemAvatar sx={{ mr: 1.5, minWidth: 0 }}>
            <Box sx={{ position: 'relative', width: 48, height: 48 }}>
              <Avatar
                variant="rounded"
                src={currentTrack.imageUrl}
                alt={currentTrack.title}
                sx={{ width: 48, height: 48, borderRadius: 1 }}
              />

              <PlayArrowRoundedIcon
                className="thumb-play"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(currentTrack);
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(1.25)',
                  opacity: 1,
                  cursor: 'pointer',
                  fontSize: 32,
                  color: '#fff',
                  transition: 'all .15s ease',
                }}
              />
            </Box>
          </ListItemAvatar>

          <Box
            className="song-text"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: '100%',
              transition: 'max-width .15s ease',
            }}
          >
            <Typography noWrap fontWeight={800} color={theme.palette.text.primary}>
              {currentTrack.title}
            </Typography>

            <Typography noWrap color={theme.palette.text.secondary}>
              {normalizeArtists(currentTrack.artists)}
            </Typography>
          </Box>

          <Box
            className="song-actions"
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: ACTION_WIDTH,
              justifyContent: 'flex-end',
              opacity: 0,
              visibility: 'hidden',
              transition: 'opacity .15s ease',
            }}
          >
            <FavoriteButton size="small" aria-label="Yêu thích" />
            <MoreButton size="small" aria-label="Thêm" />
          </Box>
        </ListItem>
      </Paper>
    </Box>
  );
};

export default NowPlaying;
