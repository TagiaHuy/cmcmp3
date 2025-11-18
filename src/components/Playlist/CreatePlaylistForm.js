import React, { useState } from 'react';
import { Box, TextField, Button, FormControlLabel, Switch, Typography } from '@mui/material';

const CreatePlaylistForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('privacy', isPrivate ? 'private' : 'public');
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Tên Playlist"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        InputLabelProps={{
          sx: { color: 'text.primary', fontWeight: 600 }
        }}
      />
      <TextField
        label="Mô tả"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        InputLabelProps={{
          sx: { color: 'text.primary', fontWeight: 600 }
        }}
      />
      <Button
        variant="contained"
        component="label"
        fullWidth
      >
        Chọn ảnh
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              setImagePreviewUrl(URL.createObjectURL(file));
            } else {
              setImagePreviewUrl(null);
            }
          }}
        />
      </Button>
      {imagePreviewUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img src={imagePreviewUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', borderRadius: '8px' }} />
        </Box>
      )}
      <FormControlLabel
        control={
          <Switch
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            name="private"
            color="primary"
          />
        }
        label={<Typography color="text.primary" fontWeight={600}>Riêng tư</Typography>}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Tạo
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePlaylistForm;
