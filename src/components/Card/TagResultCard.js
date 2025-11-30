import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag'; // Assuming a generic tag icon

function TagResultCard({ tag, sx }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tags/${tag.id}`); // Assuming a route for tag details
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
      <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: (theme) => theme.palette.grey[800] }}>
        {tag.imageUrl ? (
          <img src={tag.imageUrl} alt={tag.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <TagIcon sx={{ fontSize: 30, color: (theme) => theme.palette.common.white }} />
        )}
      </Box>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1">{tag.name}</Typography>
        <Typography variant="body2" color="text.secondary">Tag</Typography>
      </Box>
    </Box>
  );
}

export default TagResultCard;
