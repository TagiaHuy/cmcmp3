import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Stack, Avatar } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const ArtistVerificationRequestForm = ({ onSubmit, error, isLoading }) => {
  const [stageName, setStageName] = useState('');
  const [artistImage, setArtistImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtistImage(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // Cleanup function to revoke the object URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!stageName.trim()) {
      setFormError('Vui lòng nhập nghệ danh.');
      return;
    }

    if (!artistImage) {
      setFormError('Vui lòng chọn ảnh đại diện.');
      return;
    }

    const formData = new FormData();
    formData.append('stageName', stageName);
    formData.append('image', artistImage);

    onSubmit(formData);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" component="h2">
          Yêu cầu xác thực nghệ sĩ
        </Typography>

        <Avatar
          src={imagePreview}
          sx={{
            width: 150,
            height: 150,
            cursor: 'pointer',
            backgroundColor: 'action.hover',
            border: (theme) => `2px dashed ${theme.palette.divider}`,
            transition: 'border-color 0.3s',
            '&:hover': {
                borderColor: 'primary.main',
            }
          }}
          onClick={handleAvatarClick}
        >
            {!imagePreview && <AddAPhotoIcon sx={{ fontSize: 50, color: 'text.secondary' }} />}
        </Avatar>
        <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleImageChange}
        />
        <Button variant="outlined" onClick={handleAvatarClick} size="small">
          Chọn ảnh
        </Button>

        <TextField
          label="Nghệ danh"
          variant="outlined"
          fullWidth
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          required
        />

        {formError && (
          <Typography color="error" variant="body2">
            {formError}
          </Typography>
        )}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" disabled={isLoading} fullWidth sx={{ mt: 2, bgcolor: '#9353FF', '&:hover': { bgcolor: '#7a42cc' } }}>
          {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ArtistVerificationRequestForm;
