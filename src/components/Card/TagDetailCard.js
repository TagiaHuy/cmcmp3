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
          width: { xs: 220, md: 300 },
          height: { xs: 220, md: 300 },
          borderRadius: '32px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundSize: '300% 300%',
          backgroundImage:
            'linear-gradient(135deg, #667eea, #764ba2, #6dd5ed, #8fd3f4)',
          animation: 'gradientMove 8s ease infinite',
          boxShadow: `
            0 40px 90px rgba(0,0,0,0.6),
            inset 0 0 30px rgba(255,255,255,0.12)
          `,
          overflow: 'hidden',
          transition: 'transform 0.4s ease',

          '@keyframes gradientMove': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top, rgba(255,255,255,0.35), transparent 60%)',
            opacity: 0.8,
          },

          '&::after': {
            content: '""',
            position: 'absolute',
            inset: -30,
            background:
              'radial-gradient(circle, rgba(102,126,234,0.35), transparent 70%)',
            filter: 'blur(30px)',
            opacity: 0.7,
          },

          '&:hover': {
            transform: 'scale(1.06) rotate(-0.5deg)',
          },
        }}
      >
        <TagIcon
          sx={{
            fontSize: 160,
            color: 'white',
            zIndex: 1,
            animation: 'float 3.5s ease-in-out infinite',
            filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.6))',

            '@keyframes float': {
              '0%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-16px)' },
              '100%': { transform: 'translateY(0)' },
            },
          }}
        />
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
