import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography, Modal, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AlbumList from './AlbumList';
import useUserAlbums from '../../hooks/useUserAlbums';
import CreateAlbumForm from './CreateAlbumForm';
import EditAlbumForm from './EditAlbumForm';

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

const UserAlbums = () => {
  const { albums, loading, error, addAlbum, removeAlbum, editAlbum } = useUserAlbums();
  const [openCreateAlbumModal, setOpenCreateAlbumModal] = useState(false);
  const [openEditAlbumModal, setOpenEditAlbumModal] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);

  const handleOpenCreateAlbumModal = () => setOpenCreateAlbumModal(true);
  const handleCloseCreateAlbumModal = () => setOpenCreateAlbumModal(false);

  const handleOpenEditAlbumModal = (album) => {
    setCurrentAlbum(album);
    setOpenEditAlbumModal(true);
  };
  const handleCloseEditAlbumModal = () => {
    setOpenEditAlbumModal(false);
    setCurrentAlbum(null);
  };

  const handleCreateAlbum = async (data) => {
    await addAlbum(data);
    handleCloseCreateAlbumModal();
  };

  const handleEditAlbum = async (albumId, data) => {
    await editAlbum(albumId, data);
    handleCloseEditAlbumModal();
  };

  const handleDelete = async (albumId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa album này không?')) {
      await removeAlbum(albumId);
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
          onClick={handleOpenCreateAlbumModal}
        >
          Tạo Album Mới
        </Button>
      </Box>
      {albums.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Bạn chưa có album nào. Hãy tạo một cái mới!
        </Typography>
      ) : (
        <AlbumList albums={albums} onEdit={handleOpenEditAlbumModal} onDelete={handleDelete} />
      )}

      <Modal
        open={openCreateAlbumModal}
        onClose={handleCloseCreateAlbumModal}
        aria-labelledby="create-album-modal-title"
        aria-describedby="create-album-modal-description"
      >
        <Box sx={style}>
          <Typography id="create-album-modal-title" variant="h6" component="h2" mb={2} color="text.primary">
            Tạo Album Mới
          </Typography>
          <CreateAlbumForm onSubmit={handleCreateAlbum} onCancel={handleCloseCreateAlbumModal} />
        </Box>
      </Modal>

      <Modal
        open={openEditAlbumModal}
        onClose={handleCloseEditAlbumModal}
        aria-labelledby="edit-album-modal-title"
        aria-describedby="edit-album-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="edit-album-modal-title" variant="h6" component="h2" color="text.primary">
              Chỉnh Sửa Album
            </Typography>
            <IconButton onClick={handleCloseEditAlbumModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          {currentAlbum && (
            <EditAlbumForm
              album={currentAlbum}
              onSubmit={handleEditAlbum}
              onCancel={handleCloseEditAlbumModal}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default UserAlbums;