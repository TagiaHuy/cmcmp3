import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UploadSongForm from '../Form/UploadSongForm';
import EditSongForm from '../Form/EditSongForm';
import SongList from '../SongList/SongList';
import { getUploadedSongs } from '../../services/songService';

const UploadedSongs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSong, setEditingSong] = useState(null);

  const fetchUploadedSongs = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const uploadedSongs = await getUploadedSongs(signal);
      setSongs(uploadedSongs || []);
    } catch (e) {
      if (e?.name !== 'AbortError') {
        setError('Không thể tải danh sách bài hát đã tải lên.');
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchUploadedSongs(ac.signal);
    return () => ac.abort();
  }, [fetchUploadedSongs]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Refresh the list after upload
    const ac = new AbortController();
    fetchUploadedSongs(ac.signal);
  };

  const handleEditClick = (song) => {
    setEditingSong(song);
  };

  const handleEditClose = () => {
    setEditingSong(null);
  };

  const handleSongUpdated = (updatedSong) => {
    setSongs((prev) =>
      prev.map((song) => (song.id === updatedSong.id ? updatedSong : song))
    );
  };

  const renderSongActions = (song, defaultActions) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        size="small"
        color="primary"
        onClick={() => handleEditClick(song)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      {defaultActions}
    </Stack>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>{error}</Typography>;
    }
    
    if (songs.length === 0) {
      return <Typography sx={{ textAlign: 'center', py: 5 }}>Bạn chưa có bài hát nào được tải lên.</Typography>;
    }

    return <SongList songs={songs} renderActions={renderSongActions} />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={handleOpenModal}>
          Tải bài hát mới
        </Button>
      </Box>

      <UploadSongForm open={modalOpen} handleClose={handleCloseModal} />
      <EditSongForm
        open={Boolean(editingSong)}
        handleClose={handleEditClose}
        song={editingSong}
        onUpdated={(updatedSong) => {
          handleSongUpdated(updatedSong);
        }}
      />

      {renderContent()}
    </Box>
  );
};

export default UploadedSongs;
