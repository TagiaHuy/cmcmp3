import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  Paper,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

import UploadSongForm from '../Form/UploadSongForm';
import EditSongForm from '../Form/EditSongForm';
import SongList from '../SongList/SongList';

import {
  getUploadedSongs,
  updateUploadedSongStatus,
  deleteSong,
} from '../../services/songService';

import { useNotifications } from '../../hooks/useNotifications';

const UploadedSongs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSong, setEditingSong] = useState(null);

  // 🔥 DELETE DIALOG STATE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);

  const { notifySuccess, notifyError } = useNotifications();

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

  /* ===================== UPLOAD ===================== */
  const handleOpenModal = () => setModalOpen(true);

  const handleCloseModal = () => {
    setModalOpen(false);
    const ac = new AbortController();
    fetchUploadedSongs(ac.signal);
  };

  /* ===================== EDIT ===================== */
  const handleEditClick = (song) => setEditingSong(song);

  const handleEditClose = () => setEditingSong(null);

  const handleSongUpdated = () => {
    const ac = new AbortController();
    fetchUploadedSongs(ac.signal);
  };

  /* ===================== DELETE ===================== */
  const handleOpenDeleteDialog = (song) => {
    setSongToDelete(song);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSongToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!songToDelete) return;

    try {
      await deleteSong(songToDelete.id);
      setSongs((prev) => prev.filter((s) => s.id !== songToDelete.id));
      notifySuccess('Xóa bài hát thành công!');
    } catch (err) {
      notifyError(err.message || 'Lỗi khi xóa bài hát.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  /* ===================== ACTIONS ===================== */
  const renderSongActions = (song, defaultActions) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <FormControl size="small" />
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
        onClick={() => handleOpenDeleteDialog(song)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      {defaultActions}
    </Stack>
  );

  /* ===================== CONTENT ===================== */
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={1}>
            Đang tải danh sách bài hát của bạn...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
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
          <Typography variant="h6">Chưa có bài hát nào</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hãy tải lên bài hát của bạn để bắt đầu.
          </Typography>
          <Button startIcon={<UploadIcon />} variant="contained" onClick={handleOpenModal}>
            Tải bài hát đầu tiên
          </Button>
        </Paper>
      );
    }

    return <SongList songs={songs} renderActions={renderSongActions} />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1800, mx: 'auto' }}>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.06))',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Bài hát đã tải lên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý bài hát của bạn
            </Typography>
          </Box>
          <Button startIcon={<UploadIcon />} variant="contained" onClick={handleOpenModal}>
            Tải bài hát mới
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        {renderContent()}
      </Paper>

      {/* MODALS */}
      <UploadSongForm open={modalOpen} handleClose={handleCloseModal} />

      <EditSongForm
        open={Boolean(editingSong)}
        handleClose={handleEditClose}
        song={editingSong}
        onUpdated={handleSongUpdated}
      />

      {/* DELETE CONFIRM DIALOG */}
<Dialog
  open={deleteDialogOpen}
  onClose={handleCloseDeleteDialog}
  PaperProps={{
    sx: {
      background: 'linear-gradient(160deg, #1f2937, #020617)',
      color: '#e5e7eb',
      borderRadius: 4,
      minWidth: 400,
      boxShadow: '0 25px 80px rgba(0,0,0,.65)',
      border: '1px solid rgba(255,255,255,0.08)',
    },
  }}
>
  {/* HEADER */}
  <DialogTitle sx={{ pb: 1 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'rgba(239,68,68,.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DeleteIcon sx={{ color: '#f87171' }} />
      </Box>

      <Box>
        <Typography fontWeight={700}>Xác nhận xóa</Typography>
        <Typography variant="body2" color="text.secondary">
          Thao tác không thể hoàn tác
        </Typography>
      </Box>
    </Stack>
  </DialogTitle>

  {/* CONTENT */}
  <DialogContent>
    <Typography>
      Bạn có chắc chắn muốn xóa bài hát
      <Box
        component="span"
        sx={{
          mx: 0.5,
          fontWeight: 700,
          color: '#60a5fa',
        }}
      >
        {songToDelete?.title}
      </Box>
      ?
    </Typography>

    <Box
      mt={2}
      p={2}
      borderRadius={2}
      sx={{
        background: 'rgba(239,68,68,.12)',
        border: '1px solid rgba(239,68,68,.25)',
      }}
    >
      <Typography variant="body2" sx={{ color: '#fecaca' }}>
        ⚠️ Dữ liệu sau khi xóa sẽ không thể khôi phục
      </Typography>
    </Box>
  </DialogContent>

  {/* ACTIONS */}
  <DialogActions sx={{ px: 3, pb: 3 }}>
    <Button
      onClick={handleCloseDeleteDialog}
      sx={{
        color: '#cbd5f5',
        textTransform: 'none',
      }}
    >
      Hủy
    </Button>

    <Button
      onClick={handleConfirmDelete}
      sx={{
        px: 3,
        fontWeight: 700,
        borderRadius: 2,
        textTransform: 'none',
        color: '#fff',
        background: 'linear-gradient(135deg,#ef4444,#dc2626)',
        '&:hover': {
          background: 'linear-gradient(135deg,#f87171,#ef4444)',
        },
      }}
    >
      Xóa bài hát
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default UploadedSongs;
