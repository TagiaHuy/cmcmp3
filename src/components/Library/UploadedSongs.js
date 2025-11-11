import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UploadSongForm from '../Form/UploadSongForm';
import SongList from '../SongList/SongList'; // Assuming you have a SongList component

const UploadedSongs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedSongs, setUploadedSongs] = useState([]); // This will hold the uploaded songs

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Here you might want to refresh the list of uploaded songs
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={handleOpenModal}>
          Tải bài hát mới
        </Button>
      </Box>

      <UploadSongForm open={modalOpen} handleClose={handleCloseModal} />

      {uploadedSongs.length > 0 ? (
        <SongList songs={uploadedSongs} />
      ) : (
        <Typography sx={{ textAlign: 'center', py: 5 }}>
          Bạn chưa có bài hát nào được tải lên.
        </Typography>
      )}
    </Box>
  );
};

export default UploadedSongs;
