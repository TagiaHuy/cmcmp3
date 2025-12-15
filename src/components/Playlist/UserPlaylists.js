import React, { useState } from 'react';
import { Box, CircularProgress, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
      {playlists.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Bạn chưa có playlist nào. Hãy tạo một cái mới!
        </Typography>
      ) : (
        <PlaylistList playlists={playlists} onEdit={handleOpenEditModal} onDelete={handleDelete} />
      )}

      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-playlist-modal-title"
        aria-describedby="edit-playlist-modal-description"
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
    </Box>
  );
};

export default UserPlaylists;