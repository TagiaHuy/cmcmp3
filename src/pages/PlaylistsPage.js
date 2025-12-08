import React, { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import PlaylistTabs from '../components/Playlist/PlaylistTabs';
import usePlaylists from '../hooks/usePlaylists';
import CreatePlaylistForm from '../components/Playlist/CreatePlaylistForm';

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

const PlaylistsPage = () => {
  const { addPlaylist } = usePlaylists();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleCreatePlaylist = async (data) => {
    await addPlaylist(data);
    handleCloseCreateModal();
  };

  return (
    <Box sx={{ p: 3, boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'text.primary', fontWeight: 700 }}>
          Playlists
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Tạo Playlist Mới
        </Button>
      </Box>
      
      <PlaylistTabs />

      <Modal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        aria-labelledby="create-playlist-modal-title"
      >
        <Box sx={style}>
          <Typography id="create-playlist-modal-title" variant="h6" component="h2" mb={2} color="text.primary">
            Tạo Playlist Mới
          </Typography>
          <CreatePlaylistForm onSubmit={handleCreatePlaylist} onCancel={handleCloseCreateModal} />
        </Box>
      </Modal>
    </Box>
  );
};

export default PlaylistsPage;
