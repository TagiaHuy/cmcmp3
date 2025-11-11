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

const CreateArtistForm = ({ open, handleClose, onArtistCreated }) => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      alert('Vui lòng nhập tên nghệ sĩ.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Xác thực không thành công. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newArtist = await response.json();
        alert('Tạo nghệ sĩ mới thành công!');
        if (onArtistCreated) {
          onArtistCreated(newArtist);
        }
        handleClose();
      } else {
        const errorData = await response.json();
        alert(`Tạo nghệ sĩ thất bại: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi tạo nghệ sĩ.');
      console.error('Error creating artist:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-artist-modal-title"
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
        <Typography id="create-artist-modal-title" variant="h6" component="h2">
          Tạo nghệ sĩ mới
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Tên nghệ sĩ"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Chọn ảnh đại diện
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>
          {imageFile && <Typography sx={{ mt: 1 }}>{imageFile.name}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Tạo nghệ sĩ
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateArtistForm;
