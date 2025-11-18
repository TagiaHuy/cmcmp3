import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import usePlaylist from '../hooks/usePlaylist';
import SongList from '../components/SongList/SongList';
import PlaylistDetailCard from '../components/Card/PlaylistDetailCard';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import useSongsByIds from '../hooks/useSongsByIds';

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const { playlist, loading, error } = usePlaylist(playlistId);
  const { songs, loading: songsLoading } = useSongsByIds(playlist?.songs);
  const { loadQueue, queue, isPlaying, setIsPlaying } = useMediaPlayer();

  console.log('Playlist object:', playlist);
  console.log('Fetched songs:', songs);

  const isPlaylistCurrentlyLoaded = songs && queue.length === songs.length && queue.every((track, index) => songs[index] && track.id === songs[index].id);

  const handlePlayPlaylist = () => {
    if (songs && songs.length > 0) {
      if (isPlaylistCurrentlyLoaded) {
        setIsPlaying(!isPlaying);
      } else {
        loadQueue(songs);
      }
    }
  };
  
  if (loading || songsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !playlist) {
    return <Typography color="error">Error fetching playlist or playlist not found.</Typography>;
  }

  return (
    <Box display={'flex'} flexDirection="row" sx={{ p: 3, width: '100%'}}>
      <PlaylistDetailCard 
        playlist={playlist} 
        handlePlayPlaylist={handlePlayPlaylist} 
        isPlaying={isPlaylistCurrentlyLoaded && isPlaying} 
      />
      <Box sx={{width: '100%'}}>
        <SongList songIds={playlist.songs} />
      </Box>
    </Box>
  );
};

export default PlaylistDetailPage;
