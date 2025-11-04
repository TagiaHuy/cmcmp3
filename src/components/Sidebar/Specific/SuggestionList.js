import React from 'react';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';

const SuggestionList = () => {
  const { recentlyPlayed, handlePlay, currentTrack } = useMediaPlayer();
  const theme = useTheme();

  if (!currentTrack) {
    return null; // Only show suggestions if a track is currently playing
  }

  // Filter out the currently playing track from the suggestion list
  const suggestions = recentlyPlayed.filter(track => track.mediaSrc !== currentTrack?.mediaSrc);

  if (!suggestions.length) {
    return null; // Don't show suggestions if there are none
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
        Gợi ý cho bạn
      </Typography>
      <List>
        {suggestions.map((track, index) => (
          <ListItem 
            key={index} 
            button 
            onClick={() => handlePlay(track)}
            sx={{ borderRadius: 2, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <ListItemAvatar>
              <Avatar variant="rounded" src={track.imageUrl} alt={track.title} />
            </ListItemAvatar>
            <ListItemText
              primary={track.title}
              secondary={track.artists}
              primaryTypographyProps={{ noWrap: true, fontWeight: 'bold', color: theme.palette.text.primary }}
              secondaryTypographyProps={{ noWrap: true, color: theme.palette.text.secondary }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SuggestionList;
