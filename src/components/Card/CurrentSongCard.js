import React from 'react';
import { Box, Typography } from '@mui/material';

const CurrentSongCard = ({ songImage, songTitle, songAuthor }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: (theme) => theme.body.background,
        borderRadius: 1.5,
        p: 1,
        width: 250,
      }}
    >
      <Box
        component="img"
        src={songImage}
        alt={songTitle}
        sx={{
          width: 50,
          height: 50,
          borderRadius: 1,
          mr: 1.5,
        }}
      />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {/* Tên bài hát — luôn theo theme: primary text */}
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 600 }}
        >
          {songTitle}
        </Typography>

        {/* Tên ca sĩ — màu phụ theo theme */}
        <Typography
          variant="caption"
          noWrap
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {songAuthor}
        </Typography>
      </Box>
    </Box>
  );
};

export default CurrentSongCard;
