import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Typography, CircularProgress, Stack, IconButton,
  FormControl, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadSongForm from '../Form/UploadSongForm';
import EditSongForm from '../Form/EditSongForm';
import SongList from '../SongList/SongList';
import { getUploadedSongs, updateUploadedSongStatus, deleteSong } from '../../services/songService';
import { useNotifications } from '../../hooks/useNotifications';

const UploadedSongs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const { notifySuccess, notifyError } = useNotifications();

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
    // also refetch to be sure
    const ac = new AbortController();
    fetchUploadedSongs(ac.signal);
  };

  const handleStatusChange = async (songId, newStatus) => {
    try {
      const updatedSong = await updateUploadedSongStatus(songId, newStatus);
      setSongs((prevSongs) => 
        prevSongs.map((s) => (s.id === songId ? updatedSong : s))
      );
      notifySuccess('Cập nhật trạng thái bài hát thành công!');
    } catch (err) {
      notifyError(err.message || 'Lỗi khi cập nhật trạng thái.');
      // Optional: Re-fetch to revert optimistic update on failure
      const ac = new AbortController();
      fetchUploadedSongs(ac.signal);
    }
  };

  const handleDeleteSong = async (songId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa bài hát này?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteSong(songId);
      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
      notifySuccess('Xóa bài hát thành công!');
    } catch (err) {
      notifyError(err.message || 'Lỗi khi xóa bài hát.');
    }
  };

  const renderSongActions = (song, defaultActions) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={song.status || ''}
          onChange={(e) => handleStatusChange(song.id, e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Song status' }}
          // A user can only change status of their approved songs
          // to public or private. Admin moderation handles other states.
          disabled={song.status !== 'PUBLIC' && song.status !== 'PRIVATE'}
        >
          <MenuItem value="PUBLIC">Công khai</MenuItem>
          <MenuItem value="PRIVATE">Riêng tư</MenuItem>
          <MenuItem value="PENDING" disabled>Đang chờ</MenuItem>
          <MenuItem value="REJECTED" disabled>Bị từ chối</MenuItem>
        </Select>
      </FormControl>
      <IconButton
        size="small"
        color="primary"
        onClick={() => handleEditClick(song)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDeleteSong(song.id)}
      >
        <DeleteIcon fontSize="small" />
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
        onUpdated={handleSongUpdated}
      />

      {renderContent()}
    </Box>
  );
};

export default UploadedSongs;