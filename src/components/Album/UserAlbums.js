import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Button, Typography, CircularProgress, Modal, IconButton,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AlbumList from './AlbumList';
import HomeAlbumList from './HomeAlbumList'; // NEW IMPORT
import useUserAlbums from '../../hooks/useUserAlbums';
import CreateAlbumForm from './CreateAlbumForm';
import EditAlbumForm from './EditAlbumForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const UserAlbums = ({ isHomepage }) => { // ACCEPT isHomepage PROP
  // Destructure fetchAlbums from the hook
  const { albums, loading, error, addAlbum, removeAlbum, editAlbum, fetchAlbums } = useUserAlbums();
  const [openCreateAlbumModal, setOpenCreateAlbumModal] = useState(false);
  const [openEditAlbumModal, setOpenEditAlbumModal] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);

  // Use useCallback for handlers
  const handleOpenCreateAlbumModal = useCallback(() => setOpenCreateAlbumModal(true), []);
  const handleCloseCreateAlbumModal = useCallback(() => {
    setOpenCreateAlbumModal(false);
    fetchAlbums(); // Refetch albums after closing create modal
  }, [fetchAlbums]);

  const handleOpenEditAlbumModal = useCallback((album) => {
    setCurrentAlbum(album);
    setOpenEditAlbumModal(true);
  }, []);

  const handleCloseEditAlbumModal = useCallback(() => {
    setOpenEditAlbumModal(false);
    setCurrentAlbum(null);
  }, []);

  const handleCreateAlbum = useCallback(async (data) => {
    await addAlbum(data);
    handleCloseCreateAlbumModal();
  }, [addAlbum, handleCloseCreateAlbumModal]);

  const handleEditAlbum = useCallback(async (albumId, data) => {
    await editAlbum(albumId, data);
    handleCloseEditAlbumModal();
  }, [editAlbum, handleCloseEditAlbumModal]);

  const handleDeleteAlbum = useCallback(async (albumId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa album này không?')) {
      await removeAlbum(albumId);
    }
  }, [removeAlbum]);

  const renderAlbumActions = (album) => (
    <Stack direction="row" spacing={2} alignItems="center"> {/* Changed spacing from 1 to 2 */}
      <IconButton
        size="small"
        color="primary"
        onClick={(e) => { e.stopPropagation(); handleOpenEditAlbumModal(album); }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.id); }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
  
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
      {!isHomepage && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, pr: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateAlbumModal}
          >
            Tạo Album Mới
          </Button>
        </Box>
      )}
      
      {isHomepage ? (
        <HomeAlbumList albums={albums} renderActions={renderAlbumActions} />
      ) : (
        <AlbumList albums={albums} renderActions={renderAlbumActions} />
      )}

      <Modal
        open={openCreateAlbumModal}
        onClose={handleCloseCreateAlbumModal}
        aria-labelledby="create-album-modal-title"
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