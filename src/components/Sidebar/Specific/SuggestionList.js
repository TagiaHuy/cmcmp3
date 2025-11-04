import React from 'react';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
} from '@mui/material';

import FavoriteButton from '../../Button/Specific/FavoriteButton';
import MoreButton from '../../Button/Specific/MoreButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

const ACTION_WIDTH = 96;

const SuggestionList = () => {
  const { recentlyPlayed, handlePlay, currentTrack } = useMediaPlayer();
  const theme = useTheme();

  if (!currentTrack) return null;

  const suggestions = recentlyPlayed.filter(
    (track) => track.mediaSrc !== currentTrack?.mediaSrc
  );
  if (!suggestions.length) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}
      >
        Gợi ý cho bạn
      </Typography>

      {/* sát mép trái/phải: bỏ padding mặc định của List */}
      <List disablePadding>
        {suggestions.map((track, index) => (
          <ListItem
            key={index}
            button
            disableGutters                 // bỏ padding trái/phải của ListItem
            onClick={() => handlePlay(track)}
            sx={{
              borderRadius: 2,
              pl: 0,                        // sát trái
              pr: 0,                        // sát phải khi chưa hover
              position: 'relative',
              cursor: 'pointer',
              transition: 'background .15s ease, padding-right .15s ease',
              '&:hover': {
                background: 'rgba(155, 77, 224, 0.18)',
                pr: `${ACTION_WIDTH}px`,    // chỉ khi hover mới chừa chỗ cho cụm nút
              },
              '&:hover .song-actions': { opacity: 1, visibility: 'visible' },
              '&:hover .thumb-play': {
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1.25)',
                filter: 'drop-shadow(0 0 10px rgba(155,77,224,0.85))'
              },
              '&:hover .song-text': {
                maxWidth: `calc(100% - ${ACTION_WIDTH}px)`,
              },
            }}
          >
            <ListItemAvatar sx={{ mr: 1.5 }}>
              <Box sx={{ position: 'relative', width: 44, height: 44 }}>
                <Avatar
                  variant="rounded"
                  src={track.imageUrl}
                  alt={track.title}
                  sx={{ width: 44, height: 44, borderRadius: 1 }}
                />
                <PlayArrowRoundedIcon
                  className="thumb-play"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(track);
                  }}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 0,
                    transition: 'all .15s ease',
                    cursor: 'pointer',
                    fontSize: 26,
                    color: '#fff',
                    filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.65))'
                  }}
                />
              </Box>
            </ListItemAvatar>

            {/* chữ dài tối đa bình thường, thu lại khi hover */}
            <Box
              className="song-text"
              sx={{
                flex: 1,
                minWidth: 0,
                maxWidth: '100%',
                transition: 'max-width .15s ease',
              }}
            >
              <Typography noWrap fontWeight="bold" color={theme.palette.text.primary}>
                {track.title}
              </Typography>
              <Typography noWrap color={theme.palette.text.secondary}>
                {track.artists}
              </Typography>
            </Box>

            {/* cụm nút đặt absolute, không chiếm chỗ khi chưa hover */}
            <Box
              className="song-actions"
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,                    // sát mép phải
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: ACTION_WIDTH,
                justifyContent: 'flex-end',
                opacity: 0,
                visibility: 'hidden',
                transition: 'opacity .15s ease'
              }}
            >
              <FavoriteButton size="small" aria-label="Yêu thích" />
              <MoreButton size="small" aria-label="Thêm" />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SuggestionList;
