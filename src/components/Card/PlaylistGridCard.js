import React from 'react';
import { Typography, Box } from '@mui/material';
import PlayableImage from './PlayableImage';
import { useNavigate } from 'react-router-dom';

const PlaylistGridCard = ({ playlist, onPlay, isLoading }) => {
  const navigate = useNavigate(); // Moved to top level

  if (!playlist) return null;

  const handleCardClick = () => {
    navigate(`/playlists/${playlist.id}`);
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        position: 'relative',
        width: 180,
        cursor: 'pointer',
        transition: 'transform .2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <PlayableImage
        imageUrl={playlist.imageUrl}
        title={playlist.title}
        size={180}
        hideOverlay={true}
        onPlay={onPlay}
        isLoading={isLoading}
      />
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        noWrap
        sx={{ color: 'text.primary', mt: 1, px: 0.5 }}
      >
        {playlist.title}
      </Typography>
    </Box>
  );
};

export default PlaylistGridCard;
