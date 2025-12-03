import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Input } from '@mui/material';

const ArtistVerificationRequestForm = ({ onSubmit, error, isLoading }) => {
  const [stageName, setStageName] = useState('');
  const [artistImage, setArtistImage] = useState(null);
  const [formError, setFormError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArtistImage(e.target.files[0]);
    }
  };

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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Yêu cầu xác thực tài khoản nghệ sĩ
      </Typography>
      <TextField
        label="Nghệ danh"
        variant="outlined"
        fullWidth
        value={stageName}
        onChange={(e) => setStageName(e.target.value)}
        required
      />
       <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{
            justifyContent: 'flex-start',
            color: artistImage ? 'text.primary' : 'grey.500',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.87)',
            },
            textTransform: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            py: '16.5px', 
            px: '14px',
        }}
        >
        {artistImage ? artistImage.name : "Chọn ảnh đại diện"}
        <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
        />
        </Button>

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

      <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2, bgcolor: '#9353FF', '&:hover': { bgcolor: '#7a42cc' } }}>
        {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
      </Button>
    </Box>
  );
};

export default ArtistVerificationRequestForm;
