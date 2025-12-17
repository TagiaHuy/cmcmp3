import React, { useState } from 'react';
import {
  Stack,
  Box,
  CircularProgress,
  Typography,
  Modal,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistList from './PlaylistList';
import usePlaylists from '../../hooks/usePlaylists';
import EditPlaylistForm from './EditPlaylistForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const UserPlaylists = () => {
  const { playlists, loading, error, removePlaylist, editPlaylist } = usePlaylists();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  // 🔥 THÊM STATE CHO DELETE DIALOG
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const handleOpenEditModal = (playlist) => {
    setCurrentPlaylist(playlist);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setCurrentPlaylist(null);
  };

  const handleEditPlaylist = async (playlistId, data) => {
    await editPlaylist(playlistId, data);
    handleCloseEditModal();
  };

  // ❌ BỎ window.confirm
  // ✅ MỞ DIALOG XÓA
  const handleDelete = (playlist) => {
    setPlaylistToDelete(playlist);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPlaylistToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!playlistToDelete) return;
    await removePlaylist(playlistToDelete.id);
    handleCloseDeleteDialog();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Lỗi: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {playlists.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Bạn chưa có playlist nào. Hãy tạo một cái mới!
        </Typography>
      ) : (
        <PlaylistList
          playlists={playlists}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* EDIT MODAL */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Chỉnh Sửa Playlist</Typography>
            <IconButton onClick={handleCloseEditModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {currentPlaylist && (
            <EditPlaylistForm
              playlist={currentPlaylist}
              onSubmit={handleEditPlaylist}
              onCancel={handleCloseEditModal}
            />
          )}
        </Box>
      </Modal>

      {/* DELETE CONFIRM DIALOG FOR PLAYLIST */}
<Dialog
  open={openDeleteDialog}
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
        <Typography fontWeight={700}>Xác nhận xóa playlist</Typography>
        <Typography variant="body2" color="text.secondary">
          Thao tác không thể hoàn tác
        </Typography>
      </Box>
    </Stack>
  </DialogTitle>

  {/* CONTENT */}
  <DialogContent>
    <Typography>
      Bạn có chắc chắn muốn xóa playlist{' '}
      <Box
        component="span"
        sx={{
          mx: 0.5,
          fontWeight: 700,
          color: '#60a5fa',
        }}
      >
        {playlistToDelete?.name}
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
      Xóa playlist
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default UserPlaylists;
