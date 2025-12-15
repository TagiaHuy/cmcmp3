import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  Modal,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import PlaylistList from './PlaylistList';
import usePlaylists from '../../hooks/usePlaylists';
import EditPlaylistForm from './EditPlaylistForm';
import CreatePlaylistForm from './CreatePlaylistForm';
import { useNotifications } from '../../hooks/useNotifications';

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
  const { playlists, loading, error, removePlaylist, editPlaylist, fetchPlaylists } = usePlaylists();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const { notifySuccess, notifyError } = useNotifications();

  const handleOpenEditModal = (playlist) => {
    setCurrentPlaylist(playlist);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setCurrentPlaylist(null);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    fetchPlaylists(); // Refresh the list after creation
  };

  const handleEditPlaylist = async (playlistId, data) => {
    await editPlaylist(playlistId, data);
    notifySuccess('Chỉnh sửa playlist thành công!');
    handleCloseEditModal();
  };

  const handleDelete = async (playlistId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa playlist này không?')) {
      try {
        await removePlaylist(playlistId);
        notifySuccess('Xóa playlist thành công!');
      } catch (err) {
        notifyError(err.message || 'Lỗi khi xóa playlist.');
      }
    }
  };

  const renderPlaylistActions = (playlist) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        size="small"
        color="primary"
        onClick={() => handleOpenEditModal(playlist)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDelete(playlist.id)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Đang tải danh sách playlist của bạn...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          Lỗi: {error.message}
        </Alert>
      );
    }

    if (playlists.length === 0) {
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
            Chưa có playlist nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hãy tạo playlist đầu tiên để sắp xếp bộ sưu tập của bạn.
          </Typography>
          <Button startIcon={<AddPhotoAlternateIcon />} variant="contained" onClick={handleOpenCreateModal}>
            Tạo playlist đầu tiên
          </Button>
        </Paper>
      );
    }

    return <PlaylistList playlists={playlists} renderActions={renderPlaylistActions} />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1800, mx: 'auto' }}>
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
              Playlist đã tải lên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý và chỉnh sửa các playlist cá nhân của bạn.
            </Typography>
          </Box>
          <Button startIcon={<AddPhotoAlternateIcon />} variant="contained" onClick={handleOpenCreateModal}>
            Tạo playlist mới
          </Button>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        {renderContent()}
      </Paper>

      <Modal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        aria-labelledby="create-playlist-modal-title"
        aria-describedby="create-playlist-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="create-playlist-modal-title" variant="h6" component="h2" color="text.primary">
              Tạo Playlist Mới
            </Typography>
            <IconButton onClick={handleCloseCreateModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <CreatePlaylistForm onCreated={handleCloseCreateModal} />
        </Box>
      </Modal>
      <EditPlaylistForm
        open={Boolean(currentPlaylist)}
        handleClose={handleCloseEditModal}
        playlist={currentPlaylist}
        onSubmit={handleEditPlaylist}
      />
    </Box>
  );
};

export default UserPlaylists;