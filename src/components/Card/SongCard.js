import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
// import { useMediaPlayer } from '../../context/MediaPlayerContext'; // Removed direct use
import PlayableImage from './PlayableImage'; // Re-using the playable image component

const SongCard = ({ song, onPlay }) => { // Accept onPlay prop
  // const { handlePlay } = useMediaPlayer(); // Removed direct use

  const handlePlayClick = () => { // Renamed for clarity
    if (song && onPlay) {
      onPlay(song); // Call the onPlay prop from parent
    }
  };

  const artists = song.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist';

  return (
    <Box sx={{ position: 'relative', width: 180, cursor: 'pointer' }}>
      <Card
        sx={{
          width: '100%',
          transition: 'transform .2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <PlayableImage
          imageUrl={song.imageUrl}
          title={song.title}
          onPlay={handlePlayClick} // Pass the local handler
          size={180}
        >
          <CardMedia
            component="img"
            height="180"
            image={song.imageUrl || 'https://via.placeholder.com/180'}
            alt={song.title}
          />
        </PlayableImage>
        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            noWrap
            sx={{ color: 'text.primary' }}
          >
            {song.title}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{ color: 'text.secondary' }}
          >
            {artists}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SongCard;
