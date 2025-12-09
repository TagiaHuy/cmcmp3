import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Menu } from '@mui/material';
import BasePlayableImage from './Base/BasePlayableImage';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import ShareMenu from '../../MenuItem/Specific/ShareMenu';

function PlaylistCard({ id, mediaSrc, imageUrl, title, subtitle, onPlay, sx }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null); // State for MoreButton menu
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation(); // Ngăn card click event
    if (onPlay) {
      onPlay({
        id,
        title,
        artists: subtitle,
        imageUrl: imageUrl,
        mediaSrc,
      });
    }
  };

  const handleCardClick = () => {
        navigate(`/songs/${id}`);

    navigate(`/playlists/${id}`);
  };

  return (
    <Box
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ 
        p: 1,
        bgcolor: (theme) => isHovered ? theme.palette.action.hover : theme.palette.background, 
        borderRadius: 2,
        width: 340,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        ...sx,
      }}
    >
      <BasePlayableImage
        mediaSrc={mediaSrc}
        onPlay={handlePlayClick}
        size={50}
        isHovered={isHovered}
        hidePlayButtonBorder='true'
      >
        <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </BasePlayableImage>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" sx={{ color: (theme) => isHovered ? theme.palette.text.primary : theme.palette.text.primary }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: (theme) => isHovered ? theme.palette.text.primary : theme.palette.text.secondary }}>{subtitle}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, width: 88, justifyContent: 'flex-end' }}>
        <FavoriteButton />
        <MoreButton onClick={handleMenuOpen} />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <ShareMenu anchorEl={anchorEl} open={open} onCloseMenu={handleMenuClose} type="playlist" id={id} />
        </Menu>
      </Box>
    </Box>
  );
}

export default PlaylistCard;
