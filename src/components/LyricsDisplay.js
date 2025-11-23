import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LyricsDisplay = ({ lyrics, currentTime }) => {
  const theme = useTheme();
  const lyricRefs = useRef([]);

  useEffect(() => {
    if (!lyrics || lyrics.length === 0) return;

    const activeLyricIndex = lyrics.findIndex((lyric, index) => {
      const nextLyricTime = lyrics[index + 1] ? lyrics[index + 1].time : Infinity;
      return currentTime >= lyric.time && currentTime < nextLyricTime;
    });

    if (activeLyricIndex !== -1 && lyricRefs.current[activeLyricIndex]) {
      // Scroll to the active lyric
      lyricRefs.current[activeLyricIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime, lyrics]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <Box sx={{ mt: 2, p: 2, textAlign: 'center', color: theme.palette.text.secondary }}>
        <Typography variant="body2">No lyrics available for this song.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 2,
        height: '400px', // Adjust height as needed
        overflowY: 'auto',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.1)',
        borderRadius: 2,
        p: 2,
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '8px'
        },
      }}
    >
      {lyrics.map((lyric, index) => {
        const isActive =
          currentTime >= lyric.time &&
          (lyrics[index + 1] ? currentTime < lyrics[index + 1].time : true);
        return (
          <Typography
            key={index}
            ref={(el) => (lyricRefs.current[index] = el)}
            variant="h6"
            sx={{
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              transition: 'color 0.3s ease, font-weight 0.3s ease',
              mb: 1,
            }}
          >
            {lyric.text}
          </Typography>
        );
      })}
    </Box>
  );
};

export default LyricsDisplay;
