import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import useAlbum from '../hooks/useAlbum';
import useUserAlbums from '../hooks/useUserAlbums';
import SongList from '../components/SongList/SongList';
import AlbumDetailCard from '../components/Card/AlbumDetailCard';
import Comment from '../components/Comment/Comment';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { useNotifications } from '../hooks/useNotifications';

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const { notifyError } = useNotifications();

  // Using useUserAlbums hook for fetching songs
  const { getSongsForAlbum } = useUserAlbums();
  const { album, loading, error, setAlbum } = useAlbum(albumId);
  const { loadQueue, queue, isPlaying, setIsPlaying } = useMediaPlayer();

  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);

  useEffect(() => {
    if (album) {
      const fetchSongs = async () => {
        try {
          setSongsLoading(true);
          const fetchedSongs = await getSongsForAlbum(album.id);
          setSongs(fetchedSongs);
        } catch (err) {
          if (err.name !== 'AbortError') {
            notifyError('Could not load songs for the album.');
          }
        } finally {
          setSongsLoading(false);
        }
      };
      fetchSongs();
    }
  }, [album, getSongsForAlbum, notifyError]);

  const isAlbumCurrentlyLoaded = useMemo(() => 
    songs && queue.length === songs.length && queue.every((track, index) => songs[index] && track.id === songs[index].id),
    [songs, queue]
  );

  const handlePlayAlbum = () => {
    if (songs && songs.length > 0) {
      if (isAlbumCurrentlyLoaded) {
        setIsPlaying(!isPlaying);
      } else {
        const unifiedSongs = songs.map(song => ({
            ...song,
            mediaSrc: song.filePath,
            artists: Array.isArray(song.artists) ? song.artists.map(a => a.name).join(', ') : song.artists,
        }));
        loadQueue(unifiedSongs);
      }
    }
  };

  const handleLikeToggle = (isFavorited) => {
    setAlbum(prevAlbum => {
      if (prevAlbum) {
        return {
         ...prevAlbum,
          isFavorite: isFavorited,
          likeCount: isFavorited? prevAlbum.likeCount + 1 : prevAlbum.likeCount - 1,
        };
      }
      return prevAlbum;
    });
  };

  if (loading || songsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{p: 3}}>Error fetching album: {error.message}</Typography>;
  }

  if (!album) {
    return <Typography sx={{p: 3}}>Album not found.</Typography>;
  }

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} sx={{ p: 3, width: '100%' }}>
      <Box sx={{ flex: '0 1 400px', mb: { xs: 3, md: 0 } }}>
        <AlbumDetailCard 
          album={album} 
          handlePlayAlbum={handlePlayAlbum} 
          isPlaying={isAlbumCurrentlyLoaded && isPlaying}
          onLikeToggle={handleLikeToggle}
        />
      </Box>

      <Box sx={{ flex: '1 1 auto', ml: { md: 3 } }}>
        <SongList songs={songs} />
        <Comment albumId={albumId} />
      </Box>
    </Box>
  );
};

export default AlbumDetailPage;
