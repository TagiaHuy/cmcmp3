import React from 'react';
import { Box, Typography } from '@mui/material';
import BaseCard from './BaseCard';
import PlayableImage from './PlayableImage';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

const FALLBACK_BG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='130'>
       <defs><linearGradient id='g' x1='0' y1='1' x2='0' y2='0'>
         <stop offset='0' stop-color='#171821'/>
         <stop offset='1' stop-color='#1e2130'/>
       </linearGradient></defs>
       <rect width='100%' height='100%' fill='url(#g)'/>
     </svg>`
  );

function SongCardDetailed({ song }) {
  const { handlePlay } = useMediaPlayer();

  const onPlay = () => {
    console.log(`Attempting to play song: ${song?.title}`);
    if (song) {
      handlePlay(song);
    }
  };

  const {
    title = 'Unknown Song',
    artists = 'Unknown Artist',
    imageUrl = '',
  } = song || {};
  
  const artistNames = Array.isArray(artists) ? artists.map(a => a.name).join(', ') : artists;

  const safeBg = imageUrl || FALLBACK_BG;

  const cardStyle = {
    width: 320,
    height: 130,
    borderRadius: '4px',
    padding: 2,
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
      zIndex: 1,
    },
  };

  return (
    <BaseCard sx={cardStyle}>
        <>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${safeBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(8px)',
              transform: 'scale(1.05)',
              willChange: 'filter, transform',
              zIndex: 0,
            }}
          />
        </>

      <PlayableImage
        imageUrl={imageUrl}
        title={title}
        size={130} // Match the default size
        sx={{ position: 'absolute', top: 15, left: 15, zIndex: 2 }}
        onPlay={onPlay}
        song={song}
        mediaSrc={song.mediaSrc} // Pass the mediaSrc prop
      />

      <Box sx={{ marginLeft: '160px', zIndex: 3, paddingBottom: 3, position: 'relative' }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color='white'
          sx={{ lineHeight: 1.2 }}
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
          color='#ccc'
          mt={0.5}
          sx={{ display: 'block' }}
        >
          {artistNames}
        </Typography>
      </Box>
    </BaseCard>
  );
}

export default SongCardDetailed;
