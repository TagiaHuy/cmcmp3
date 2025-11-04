import React from 'react';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper
} from '@mui/material';

import FavoriteButton from '../../Button/Specific/FavoriteButton';
import MoreButton from '../../Button/Specific/MoreButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

const NowPlaying = () => {
  const { currentTrack, handlePlay } = useMediaPlayer();
  const theme = useTheme();

  if (!currentTrack) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2,
        mb: 3,
        background: 'rgba(155, 77, 224, 0.28)', // highlight tím
        border: '1px solid rgba(155,77,224,0.55)'
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}
      >
        Đang phát
      </Typography>

      <ListItem
        sx={{
          position: 'relative',
          borderRadius: 2,
          pr: '96px',

          transition: 'background .15s ease, box-shadow .15s ease',
          '&:hover': {
            background: 'rgba(155, 77, 224, 0.35)', // hover tím mạnh hơn phần dưới
          },

          '&:hover .thumb-play': {
            transform: 'translate(-50%, -50%) scale(1.35)',
            filter: 'drop-shadow(0 0 14px rgba(155,77,224,1))'
          }
        }}
      >
        <ListItemAvatar sx={{ mr: 1.5 }}>
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
                filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.8))',
                transition: 'all .15s ease'
              }}
            />
          </Box>
        </ListItemAvatar>

        <ListItemText
          primary={currentTrack.title}
          secondary={currentTrack.artists}
          primaryTypographyProps={{ noWrap: true, fontWeight: 800 }}
          secondaryTypographyProps={{ noWrap: true }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 8,
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <FavoriteButton size="small" aria-label="Yêu thích" />
          <MoreButton size="small" aria-label="Thêm" />
        </Box>
      </ListItem>
    </Paper>
  );
};

export default NowPlaying;
