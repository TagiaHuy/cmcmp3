import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import useArtist from '../hooks/useArtist';
import ArtistDetailCard from '../components/Card/ArtistDetailCard';
import SongList from '../components/SongList/SongList';
import useArtistSongs from '../hooks/useArtistSongs';

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { artist, loading: artistLoading, error: artistError } = useArtist(artistId);
  const { songs, loading: songsLoading, error: songsError } = useArtistSongs(artistId);
  const songIds = Object.values(songs).map(song => song.id);
  console.log(songIds);
  if (artistLoading || songsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (artistError || songsError) {
    return <Typography color="error">Error fetching artist details.</Typography>;
  }

  if (!artist) {
    return <Typography>Artist not found.</Typography>;
  }

  return (
    <Box gap={5} display={'flex'} flexDirection="row" sx={{ p: 3 } }>
      <ArtistDetailCard artist={artist} />
      <Box sx={{width: '100%'}}>
        <SongList songIds={songIds} />
      </Box>
    </Box>
  );
};

export default ArtistDetailPage;
