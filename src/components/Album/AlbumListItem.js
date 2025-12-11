import React from 'react';
import { ListItem, ListItemText, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PlayableImage from '../Card/PlayableImage'; // Using PlayableImage like SongListItem

const AlbumListItem = ({ album, onPlay, renderActions }) => {
  const navigate = useNavigate();

  if (!album) return null;

  // Since albums don't play directly, the onPlay for the image can navigate or do nothing.
  const handleImageClick = () => {
    navigate(`/albums/${album.id}`);
  };

  const secondaryText = `${album.songCount || 0} bài hát • ${album.privacy || 'Public'}`;

  // Default actions can be defined here if needed, but for now, we rely on renderActions
  const defaultActions = null;

  return (
    <ListItem
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        borderRadius: '4px',
        p: '16px 32px', // Changed padding to apply more horizontal spacing
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'hidden' }}>
        <PlayableImage
            imageUrl={album.imageUrl}
            title={album.title}
            size={56}
            borderRadius="4px"
            onPlay={handleImageClick} // Navigates on click
            hideOverlay={true} // Hide overlay as albums aren't directly playable
            sx={{ mr: 2, flexShrink: 0 }}
        />
        <ListItemText
          primary={
            <Link to={`/albums/${album.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography noWrap variant="h6" sx={{ color: 'text.primary', '&:hover': { textDecoration: 'underline' } }}>
                {album.title}
              </Typography>
            </Link>
          }
          secondary={
            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
              {secondaryText}
            </Typography>
          }
          sx={{ overflow: 'hidden' }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flexShrink: 0 }}>
        {renderActions ? renderActions(album, defaultActions) : defaultActions}
      </Box>
    </ListItem>
  );
};

export default AlbumListItem;