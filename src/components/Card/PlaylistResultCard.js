import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';

function PlaylistResultCard({ playlist, sx }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <Box
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 1,
        bgcolor: (theme) => isHovered ? theme.palette.action.hover : 'transparent',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        ...sx,
      }}
    >
      <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden' }}>
        <img src={playlist.imageUrl} alt={playlist.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1">{playlist.title}</Typography>
        <Typography variant="body2" color="text.secondary">Playlist</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, width: 88, justifyContent: 'flex-end' }}>
        <FavoriteButton visible={isHovered} />
        <MoreButton visible={isHovered} />
      </Box>
    </Box>
  );
}

export default PlaylistResultCard;
