import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistList from './PlaylistList';
import usePlaylists from '../../hooks/usePlaylists';
import CreatePlaylistForm from './CreatePlaylistForm';
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
  const { playlists, loading, error, addPlaylist, removePlaylist, editPlaylist } = usePlaylists();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenEditModal = (playlist) => {
    setCurrentPlaylist(playlist);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setCurrentPlaylist(null);
  };

  const handleCreatePlaylist = async (data) => {
    await addPlaylist(data);
    handleCloseCreateModal();
  };

  const handleEditPlaylist = async (playlistId, data) => {
    await editPlaylist(playlistId, data);
    handleCloseEditModal();
  };

  const handleDelete = async (playlistId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa playlist này không?')) {
      await removePlaylist(playlistId);
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Tạo Playlist Mới
        </Button>
      </Box>
      {playlists.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Bạn chưa có playlist nào. Hãy tạo một cái mới!
        </Typography>
      ) : (
        <PlaylistList playlists={playlists} onEdit={handleOpenEditModal} onDelete={handleDelete} />
      )}

      <Modal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        aria-labelledby="create-playlist-modal-title"
        aria-describedby="create-playlist-modal-description"
      >
        <Box sx={style}>
          <Typography id="create-playlist-modal-title" variant="h6" component="h2" mb={2} color="text.primary">
            Tạo Playlist Mới
          </Typography>
          <CreatePlaylistForm onSubmit={handleCreatePlaylist} onCancel={handleCloseCreateModal} />
        </Box>
      </Modal>

      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-playlist-modal-title"
        aria-describedby="edit-playlist-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-playlist-modal-title" variant="h6" component="h2" mb={2} color="text.primary">
            Chỉnh Sửa Playlist
          </Typography>
          {currentPlaylist && (
            <EditPlaylistForm
              playlist={currentPlaylist}
              onSubmit={handleEditPlaylist}
              onCancel={handleCloseEditModal}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default UserPlaylists;