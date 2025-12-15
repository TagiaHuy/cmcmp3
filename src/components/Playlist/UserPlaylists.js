import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Modal,
  IconButton,
  Paper,
  Stack,
  Button,
  Divider,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlaylistList from './PlaylistList';
import usePlaylists from '../../hooks/usePlaylists';
import EditPlaylistForm from './EditPlaylistForm';
import CreatePlaylistForm from './CreatePlaylistForm'; // Import create form

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false); // State for create modal
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const handleOpenEditModal = (playlist) => {
    setCurrentPlaylist(playlist);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentPlaylist(null);
  };

  // Handlers for Create Modal
  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  
  const handlePlaylistCreated = useCallback(() => {
    // The usePlaylists hook should ideally refetch or update the list.
    // For now, we manually trigger a refetch.
    const ac = new AbortController();
    fetchPlaylists(ac.signal);
    handleCloseCreateModal();
  }, [fetchPlaylists]);


  const handleEditPlaylist = async (playlistId, data) => {
    await editPlaylist(playlistId, data);
    handleCloseEditModal();
  };

  const handleDelete = async (playlistId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa playlist này không?')) {
      await removePlaylist(playlistId);
    }
  };
  
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
          {error.message || 'Không thể tải danh sách playlist đã tạo.'}
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

    return <PlaylistList playlists={playlists} onEdit={handleOpenEditModal} onDelete={handleDelete} />;
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
              Playlist đã tạo
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
      
      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-playlist-modal-title"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="edit-playlist-modal-title" variant="h6" component="h2" color="text.primary">
              Chỉnh Sửa Playlist
            </Typography>
            <IconButton onClick={handleCloseEditModal} aria-label="close">
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

      {/* Create Modal */}
      <CreatePlaylistForm 
        open={createModalOpen}
        handleClose={handleCloseCreateModal}
        onCreated={handlePlaylistCreated}
      />

    </Box>
  );
};

export default UserPlaylists;