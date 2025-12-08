import React, { useState, useRef } from 'react';
import { Box, TextField, Button, FormControlLabel, Switch, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Loading from '../Loading/Loading';

const CreateAlbumForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // New state for image load effect
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('privacy', isPrivate ? 'PRIVATE' : 'PUBLIC');
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImageFile = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Tên Album"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          InputLabelProps={{
            sx: { color: 'text.primary', fontWeight: 600 }
          }}
          disabled={isLoading}
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
          disabled={isLoading}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          disabled={isLoading}
        >
          Chọn ảnh
          <input
            type="file"
            hidden
            accept="image/*"
            ref={imageInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              if (file) {
                setImagePreviewUrl(URL.createObjectURL(file));
                setIsImageLoaded(false); // Reset load state for new image
              } else {
                setImagePreviewUrl(null);
                setIsImageLoaded(false);
              }
            }}
            disabled={isLoading}
          />
        </Button>
        {imageFile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography sx={{ flexGrow: 1, color:"text.primary" }} noWrap>{imageFile.name}</Typography>
              <IconButton onClick={handleRemoveImageFile} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
        )}
        {imagePreviewUrl && (
          <Box sx={{ mt: 2, textAlign: 'center', overflow: 'hidden' }}>
            <img
              src={imagePreviewUrl}
              alt="Image Preview"
              onLoad={() => setIsImageLoaded(true)}
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '200px',
                borderRadius: '8px',
                opacity: isImageLoaded ? 1 : 0,
                clipPath: isImageLoaded ? 'inset(0% 0% 0% 0%)' : 'inset(95% 0% 0% 0%)', // Reveal from bottom
                transition: 'opacity 0.7s ease-out, clip-path 0.7s ease-out', // Smooth transition for both
              }}
            />
          </Box>
        )}
        <FormControlLabel
          control={
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              name="private"
              color="primary"
              disabled={isLoading}
            />
          }
          label={<Typography color="text.primary" fontWeight={600}>Riêng tư</Typography>}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            Tạo
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateAlbumForm;