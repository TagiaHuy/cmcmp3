import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
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
  const statusLabels = {
    PUBLIC: 'Công khai',
    PRIVATE: 'Riêng tư',
    PENDING: 'Đang chờ',
    REJECTED: 'Bị từ chối',
  };

  const fetchUploadedSongs = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const uploadedSongs = await getUploadedSongs('', signal);
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
      <FormControl
        size="small"
        sx={{
          minWidth: 150,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: 1,
          px: 1,
        }}
      >
        <Select
          value={song.status || ''}
          onChange={(e) => handleStatusChange(song.id, e.target.value)}
          displayEmpty
          renderValue={(value) =>
            statusLabels[value] || 'Chọn trạng thái'
          }
          inputProps={{ 'aria-label': 'Trạng thái bài hát' }}
          // A user can only change status of their approved songs
          // to public or private. Admin moderation handles other states.
          disabled={song.status !== 'PUBLIC' && song.status !== 'PRIVATE'}
        >
          <MenuItem value="PUBLIC">{statusLabels.PUBLIC}</MenuItem>
          <MenuItem value="PRIVATE">{statusLabels.PRIVATE}</MenuItem>
          <MenuItem value="PENDING" disabled>{statusLabels.PENDING}</MenuItem>
          <MenuItem value="REJECTED" disabled>{statusLabels.REJECTED}</MenuItem>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Đang tải danh sách bài hát của bạn...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (songs.length === 0) {
      return (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderStyle: 'dashed',
          }}
        >
          <LibraryMusicIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Chưa có bài hát nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hãy tải lên bài hát của bạn để bắt đầu bộ sưu tập cá nhân.
          </Typography>
          <Button startIcon={<UploadIcon />} variant="contained" onClick={handleOpenModal}>
            Tải bài hát đầu tiên
          </Button>
        </Paper>
      );
    }

    return <SongList songs={songs} renderActions={renderSongActions} />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.06))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Bài hát đã tải lên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý, chỉnh sửa và điều chỉnh quyền hiển thị bài hát của bạn.
            </Typography>
          </Box>
          <Button startIcon={<UploadIcon />} variant="contained" onClick={handleOpenModal}>
            Tải bài hát mới
          </Button>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        {renderContent()}
      </Paper>

      <UploadSongForm open={modalOpen} handleClose={handleCloseModal} />
      <EditSongForm
        open={Boolean(editingSong)}
        handleClose={handleEditClose}
        song={editingSong}
        onUpdated={handleSongUpdated}
      />
    </Box>
  );
};

export default UploadedSongs;