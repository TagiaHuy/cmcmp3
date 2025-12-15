import React, { useState, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Modal,
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Loading from '../Loading/Loading';
import { createPlaylist } from '../../services/playlistService';
import { useNotifications } from '../../hooks/useNotifications';

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
  maxHeight: '90vh',
  overflowY: 'auto',
};

const CreatePlaylistForm = ({ open, handleClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef(null);
  const { notifySuccess, notifyError, notifyWarning } = useNotifications();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageFile(null);
    setImagePreviewUrl(null);
    setIsImageLoaded(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const internalHandleClose = () => {
    if (isLoading) return;
    resetForm();
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      notifyWarning('Vui lòng nhập tên playlist.');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }
    
    try {
      const newPlaylist = await createPlaylist(formData);
      notifySuccess('Tạo playlist thành công!');
      if (onCreated) {
        onCreated(newPlaylist);
      }
      resetForm();
      handleClose(); // Close immediately after success
    } catch (err) {
      notifyError(err.message || 'Lỗi khi tạo playlist.');
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
    <Modal
      open={open}
      onClose={internalHandleClose}
      aria-labelledby="create-playlist-modal-title"
    >
      <Box sx={style}>
        {isLoading && <Loading />}
        <IconButton
          aria-label="close"
          onClick={internalHandleClose}
          disabled={isLoading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="create-playlist-modal-title" variant="h6" component="h2" color="primary.main">
          Tạo Playlist Mới
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Tên Playlist"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
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
            disabled={isLoading}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            disabled={isLoading}
          >
            Chọn ảnh bìa (tùy chọn)
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
                  setIsImageLoaded(false);
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
                <Typography sx={{ flexGrow: 1 }} noWrap>{imageFile.name}</Typography>
                <IconButton onClick={handleRemoveImageFile} size="small" disabled={isLoading}>
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
                  clipPath: isImageLoaded ? 'inset(0% 0% 0% 0%)' : 'inset(95% 0% 0% 0%)',
                  transition: 'opacity 0.7s ease-out, clip-path 0.7s ease-out',
                }}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={internalHandleClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              Tạo
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePlaylistForm;
