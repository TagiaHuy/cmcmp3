import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const UploadSongForm = ({ open, handleClose }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !artist || !songFile || !imageFile) {
      alert('Vui lòng điền đầy đủ thông tin và chọn tệp.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('songFile', songFile);
    formData.append('imageFile', imageFile);

    try {
      const response = await fetch('/api/songs/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Tải bài hát lên thành công!');
        console.log('Upload successful:', result);
        setTitle('');
        setArtist('');
        setSongFile(null);
        setImageFile(null);
        handleClose();
      } else {
        const errorData = await response.json();
        alert(`Tải bài hát lên thất bại: ${errorData.message || response.statusText}`);
        console.error('Upload failed:', errorData);
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi tải bài hát lên.');
      console.error('Network error or unexpected error:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="upload-song-modal-title"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="upload-song-modal-title" variant="h6" component="h2" color="primary.main">
          Tải lên bài hát mới
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Tên bài hát"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="artist"
            label="Tên nghệ sĩ"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Chọn tệp bài hát (MP3)
            <input
              type="file"
              hidden
              accept=".mp3"
              onChange={(e) => setSongFile(e.target.files[0])}
            />
          </Button>
          {songFile && <Typography sx={{ mt: 1 }} color="text.primary">{songFile.name}</Typography>}
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Chọn tệp ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>
          {imageFile && <Typography sx={{ mt: 1 }} color="text.primary">{imageFile.name}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Tải lên
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadSongForm;
