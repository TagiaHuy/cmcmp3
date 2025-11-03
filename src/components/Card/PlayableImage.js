import React, { useState } from 'react';
import { Box } from '@mui/material';
import BasePlayableImage from './Base/BasePlayableImage';

const PlayableImage = ({ imageUrl, title, size = 130, borderRadius = '4px', sx, onPlay, playlist, mediaSrc }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = () => {
    if (onPlay && playlist) {
      onPlay(playlist);
    }
  };

  return (
    <BasePlayableImage
      onPlay={handlePlayClick}
      mediaSrc={mediaSrc}
      size={size}
      borderRadius={borderRadius}
      sx={sx}
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      />
    </BasePlayableImage>
  );
};

export default PlayableImage;