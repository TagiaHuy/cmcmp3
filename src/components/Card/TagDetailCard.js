import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import PlayallButton from '../Button/Specific/PlayallButton'; // Assuming this can be reused
import TagIcon from '@mui/icons-material/Tag';

const TagDetailCard = ({ tag, handlePlayTag, isPlaying }) => {
  return (
    <Box 
      sx={{ 
        p: { xs: 3, md: 4 }, 
        maxWidth: 1000,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
          mb: 4,
          gap: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            width: { xs: 200, md: 300 },
            height: { xs: 200, md: 300 },
            objectFit: 'cover',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.800',
          }}
        >
          <TagIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>

        <Stack>
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            Tag
          </Typography>

          <Typography 
            variant="h2"
            component="h1" 
            color="text.primary" 
            fontWeight={800}
          >
            {tag.name}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        width: '100%', 
        justifyContent: { xs: 'center', md: 'flex-start' }
      }}>
        <PlayallButton isPlaying={isPlaying} handlePlayPause={handlePlayTag} sx={{ width: 64, height: 64, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }} />
      </Box>
    </Box>
  );
};

export default TagDetailCard;
