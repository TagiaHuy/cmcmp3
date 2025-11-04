                                                                                                        import React from 'react';
import { Box, Typography } from '@mui/material';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';

const CurrentSongCard = ({ songImage, songTitle, songAuthor }) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.body.background : 'background.paper',
      borderRadius: 1,
      p: 1,
      width: 250,
    }}>
      <Box
        component="img"
        src={songImage}
        alt={songTitle}
        sx={{
          width: 50,
          height: 50,
          borderRadius: 1,
          mr: 1,
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" noWrap>{songTitle}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap>{songAuthor}</Typography>
      </Box>
    </Box>
  );
};

export default CurrentSongCard;
