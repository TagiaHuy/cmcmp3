import React, { useState } from 'react';
import { Box } from '@mui/material';
import BasePlayableImage from './Base/BasePlayableImage';
import { normalizeArtists } from '../../context/MediaPlayerContext';

const PlayableImage = ({
  imageUrl,
  title,
  size = 130,
  borderRadius = '4px',
  sx,
  onPlay,
  playlist,
  mediaSrc,
  artists
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // ⭐ Format track để gửi vào handlePlay()
  const unifiedTrack = playlist || {
    title,
    imageUrl,
    mediaSrc,
    artists: normalizeArtists(artists),
  };

  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(unifiedTrack);
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
        src={imageUrl || '/fallback.jpg'}
        alt={title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          borderRadius,
        }}
      />
    </BasePlayableImage>
  );
};

export default PlayableImage;
