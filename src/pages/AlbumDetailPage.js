import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Tabs, Tab, Modal } from '@mui/material'; // NEW: Modal
import useAlbum from '../hooks/useAlbum';
import useUserAlbums from '../hooks/useUserAlbums';
import SongList from '../components/SongList/SongList';
import AlbumDetailCard from '../components/Card/AlbumDetailCard';
import Comment from '../components/Comment/Comment';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext'; // NEW: Import useAuth
import EditAlbumForm from '../components/Album/EditAlbumForm'; // NEW: Import EditAlbumForm

const style = { // NEW style constant for Modal
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

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth(); // NEW: user, isAdmin
  const { notifySuccess, notifyError } = useNotifications();

  // Using useUserAlbums hook for fetching songs
  const { deleteAlbum, updateAlbum: updateAlbumService, getSongsForAlbum } = useUserAlbums(); // NEW: deleteAlbum, updateAlbumService
  const { album, loading, error, setAlbum } = useAlbum(albumId);
  const { loadQueue, queue, isPlaying, setIsPlaying, addRecentlyPlayedAlbum } = useMediaPlayer(); // ADDED: addRecentlyPlayedAlbum

  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false); // NEW STATE: editModalOpen

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

  const isOwner = useMemo(() => { // NEW: isOwner logic
    if (!user || !album) return false;
    return isAdmin || user.id === album.creator?.id;
  }, [user, album, isAdmin]);

  const handleOpenEditModal = () => setEditModalOpen(true); // NEW
  const handleCloseEditModal = () => setEditModalOpen(false); // NEW

  const handleDelete = async () => { // NEW: handleDelete
    if (window.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      try {
        await deleteAlbum(albumId);
        notifySuccess('Album deleted successfully.');
        navigate('/library/albums'); // Navigate to a safe page
      } catch (err) {
        notifyError(err.message || 'Failed to delete the album.');
      }
    }
  };

    const handleUpdate = async (id, formData) => { // NEW: handleUpdate

      try {

        const updatedAlbumData = await updateAlbumService(id, formData);

        setAlbum(prev => ({ ...prev, ...updatedAlbumData }));

        notifySuccess('Album updated successfully!');

        handleCloseEditModal();

      } catch (err) {

        notifyError(err.message || 'Failed to update the album.');

      }

    };

  const isAlbumCurrentlyLoaded = useMemo(() => 
    songs && queue.length === songs.length && queue.every((track, index) => songs[index] && track.id === songs[index].id),
    [songs, queue]
  );

  const handlePlayAlbum = () => {
    if (songs && songs.length > 0) {
      addRecentlyPlayedAlbum(album); // NEW: Add album to recently played
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

  const handleTabChange = (event, newValue) => { // NEW: Tab change handler
    setSelectedTab(newValue);
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
    <> {/* Wrap with Fragment to allow Modal at the same level as Box */}
      <Box display={'flex'} flexDirection="row" sx={{ p: 3, width: '100%' }}> {/* Adjusted layout */}
        <AlbumDetailCard 
          album={album} 
          handlePlayAlbum={handlePlayAlbum} 
          isPlaying={isAlbumCurrentlyLoaded && isPlaying}
          isOwner={isOwner} // NEW PROP
          onEdit={handleOpenEditModal} // NEW PROP
          onDelete={handleDelete} // NEW PROP
        />

        <Box sx={{width: '100%'}}> {/* New container for tabs and content */}
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Songs" />
            <Tab label="Comments" />
          </Tabs>
          {selectedTab === 0 && <SongList songs={songs} album={album} />}
          {selectedTab === 1 && <Comment albumId={albumId} />} {/* Pass albumId to Comment */}
        </Box>
      </Box>

      <Modal // NEW: Modal for EditAlbumForm
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-album-modal-title"
      >
        <Box sx={style}> {/* 'style' constant should be defined at the top */}
          <Typography id="edit-album-modal-title" variant="h6" component="h2">
            Edit Album
          </Typography>
          <EditAlbumForm 
            album={album} 
            onSubmit={handleUpdate} 
            onCancel={handleCloseEditModal} 
          />
        </Box>
      </Modal>
    </>
  );
};

export default AlbumDetailPage;
