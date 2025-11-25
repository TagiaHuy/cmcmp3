import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Tabs, Tab, Modal, Button } from '@mui/material';
import usePlaylist from '../hooks/usePlaylist';
import SongList from '../components/SongList/SongList';
import PlaylistDetailCard from '../components/Card/PlaylistDetailCard';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { useAuth } from '../context/AuthContext';
import usePlaylists from '../hooks/usePlaylists';
import EditPlaylistForm from '../components/Playlist/EditPlaylistForm';
import Comment from '../components/Comment/Comment';
import { useNotifications } from '../hooks/useNotifications';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();

  // Use the renamed updatePlaylist function from the hook
  const { deletePlaylist, updatePlaylist: updatePlaylistService, getSongsForPlaylist } = usePlaylists();
  const { playlist, loading, error, setPlaylist } = usePlaylist(playlistId);
  const { loadQueue, queue, isPlaying, setIsPlaying } = useMediaPlayer();

  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (playlist?.songs) {
      const fetchSongs = async () => {
        try {
          setSongsLoading(true);
          const fetchedSongs = await getSongsForPlaylist(playlist.id);
          setSongs(fetchedSongs);
        } catch (err) {
          if (err.name !== 'AbortError') {
            notifyError('Could not load songs for the playlist.');
          }
        } finally {
          setSongsLoading(false);
        }
      };
      fetchSongs();
    } else if (playlist) {
      setSongs([]);
      setSongsLoading(false);
    }
  }, [playlist, getSongsForPlaylist, playlistId, notifyError]);

  const isOwner = useMemo(() => {
    if (!user || !playlist) return false;
    // Assuming playlist.creator is an object with an id
    return isAdmin || user.id === playlist.creator?.id;
  }, [user, playlist, isAdmin]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const isPlaylistCurrentlyLoaded = useMemo(() => 
    songs && queue.length === songs.length && queue.every((track, index) => songs[index] && track.id === songs[index].id),
    [songs, queue]
  );

  const handlePlayPlaylist = () => {
    if (songs && songs.length > 0) {
      if (isPlaylistCurrentlyLoaded) {
        setIsPlaying(!isPlaying);
      } else {
        loadQueue(songs);
      }
    }
  };

  const handleOpenEditModal = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      try {
        await deletePlaylist(playlistId);
        notifySuccess('Playlist deleted successfully.');
        navigate('/library/playlists'); // Navigate to a safe page
      } catch (err) {
        notifyError(err.message || 'Failed to delete the playlist.');
      }
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const updatedPlaylistData = await updatePlaylistService(id, formData);
      setPlaylist(prev => ({ ...prev, ...updatedPlaylistData }));
      notifySuccess('Playlist updated successfully!');
      handleCloseEditModal();
    } catch (err) {
      notifyError(err.message || 'Failed to update the playlist.');
    }
  };

  if (loading || songsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    if (error.response && error.response.status === 403) {
      return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" color="error">Access Denied</Typography>
            <Typography color="text.secondary">You do not have permission to access this playlist.</Typography>
        </Box>
      );
    }
    return <Typography color="error" sx={{p: 3}}>Error fetching playlist: {error.message}</Typography>;
  }

  if (!playlist) {
    return <Typography sx={{p: 3}}>Playlist not found.</Typography>;
  }

  return (
    <>
      <Box display={'flex'} flexDirection="row" sx={{ p: 3, width: '100%' }}>
        <PlaylistDetailCard 
          playlist={playlist} 
          handlePlayPlaylist={handlePlayPlaylist} 
          isPlaying={isPlaylistCurrentlyLoaded && isPlaying}
          isOwner={isOwner}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
        <Box sx={{width: '100%'}}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Songs" />
            <Tab label="Comments" />
          </Tabs>
          {selectedTab === 0 && <SongList songIds={playlist.songs} />}
          {selectedTab === 1 && <Comment playlistId={playlistId} />}
        </Box>
      </Box>

      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-playlist-modal-title"
      >
        <Box sx={style}>
          <Typography id="edit-playlist-modal-title" variant="h6" component="h2">
            Edit Playlist
          </Typography>
          <EditPlaylistForm 
            playlist={playlist} 
            onSubmit={handleUpdate} 
            onCancel={handleCloseEditModal} 
          />
        </Box>
      </Modal>
    </>
  );
};

export default PlaylistDetailPage;