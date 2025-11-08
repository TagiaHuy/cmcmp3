import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import BasePlayableImage from './Base/BasePlayableImage';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';

function RecommendCard({ id, mediaSrc, imageUrl, title, subtitle, onPlay, sx }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handlePlayClick = (e) => {
    // e.stopPropagation(); // Ngăn card click event
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
        <FavoriteButton visible={isHovered} />
        <MoreButton visible={isHovered} />
      </Box>
    </Box>
  );
}

export default RecommendCard;
