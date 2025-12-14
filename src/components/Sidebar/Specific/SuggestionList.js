import React, { useState } from 'react';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Menu,
  CircularProgress // Import CircularProgress for loading
} from '@mui/material';
import { Link } from 'react-router-dom';

import FavoriteButton from '../../Button/Specific/FavoriteButton';
import MoreButton from '../../Button/Specific/MoreButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DownloadMenuItem from '../../MenuItem/Specific/DownloadMenuItem';
import ShareMenu from '../../MenuItem/Specific/ShareMenu';
import useRecommendations from '../../../hooks/useRecommendations'; // Import the new hook

const ACTION_WIDTH = 96;

const SuggestionList = () => {
  const { handlePlay, currentTrack, normalizeArtists } = useMediaPlayer();
  const theme = useTheme();
  const { recs: suggestions, loading, error } = useRecommendations(); // Use the new hook

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">Lỗi khi tải gợi ý.</Typography>
      </Box>
    );
  }
  
  if (!suggestions.length) {
    return null; // Don't render anything if there are no suggestions
  }

  // Filter out the currently playing track from suggestions
  const filteredSuggestions = suggestions.filter(
    (track) => track.id !== currentTrack?.id
  );

  if (!filteredSuggestions.length) return null;


  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}
      >
        Gợi ý cho bạn
      </Typography>

      <List disablePadding>
        {filteredSuggestions.map((track, index) => (
          <ListItem
            key={track.id || index}
            button
            disableGutters
            onClick={() => handlePlay(track)}
            sx={{
              borderRadius: 2,
              pl: 0,
              pr: 0,
              position: 'relative',
              cursor: 'pointer',
              transition: 'background .15s ease, padding-right .15s ease',
              '&:hover': {
                background: 'rgba(155, 77, 224, 0.18)',
                pr: `${ACTION_WIDTH}px`,
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
                <Link to={`/songs/${track.id}`} onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {track.title}
                </Link>
              </Typography>

              <Typography noWrap color={theme.palette.text.secondary}>
                {normalizeArtists(track.artists)}
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
                transition: 'opacity .15s ease'
              }}
            >
              <FavoriteButton songId={track.id} size="small" aria-label="Yêu thích" />
              <MoreButton size="small" aria-label="Thêm" onClick={handleMenuOpen} />
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': `more-button-suggestion-${track.id}`,
                }}
              >
                <DownloadMenuItem songId={track.id} songTitle={track.title} onCloseMenu={handleMenuClose} />
                <ShareMenu anchorEl={anchorEl} open={open} onCloseMenu={handleMenuClose} type="song" id={track.id} />
              </Menu>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SuggestionList;
