import React, { useState } from 'react';
import { Autocomplete, Box, Button, TextField, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useArtists from '../../hooks/useArtists';
import useTags from '../../hooks/useTags';
import API_BASE_URL from '../../config';
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [description, setDescription] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [songFile, setSongFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { artists } = useArtists();
  const { tags } = useTags();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !songFile || !imageFile) {
      toast.warn('Vui lòng điền đầy đủ thông tin và chọn tệp.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('songFile', songFile);
    formData.append('imageFile', imageFile);
    if (description) {
        formData.append('description', description);
    }
    const artistIds = selectedArtists.map(artist => artist.id).join(',');
    if (artistIds) {
        formData.append('artistIds', artistIds);
    }
    const tagIds = selectedTags.map(tag => tag.id).join(',');
    if (tagIds) {
        formData.append('tagIds', tagIds);
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/songs/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Tải bài hát lên thành công!');
        console.log('Upload successful:', result);
        setTitle('');
        setDescription('');
        setSelectedArtists([]);
        setSelectedTags([]);
        setSongFile(null);
        setImageFile(null);
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        const errorData = await response.json();
        toast.error(`Tải bài hát lên thất bại: ${errorData.message || response.statusText}`);
        console.error('Upload failed:', errorData);
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải bài hát lên.');
      console.error('Network error or unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="upload-song-modal-title"
    >
      <Box sx={style}>
        {isLoading && <Loading />}
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
            fullWidth
            id="description"
            label="Mô tả"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Autocomplete
              multiple
              id="artist-select"
              options={artists}
              getOptionLabel={(option) => option.name}
              value={selectedArtists}
              onChange={(event, newValue) => {
                setSelectedArtists(newValue);
              }}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      margin="normal"
                      fullWidth
                      name="artist"
                      label="Tên nghệ sĩ"
                  />
              )}
          />
          <Autocomplete
              multiple
              id="tag-select"
              options={tags}
              getOptionLabel={(option) => option.name}
              value={selectedTags}
              onChange={(event, newValue) => {
                setSelectedTags(newValue);
              }}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      margin="normal"
                      fullWidth
                      name="tag"
                      label="Thẻ"
                  />
              )}
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
          {imageFile && <Typography sx={{ mt: 1 }} color="text.primary">{imageFile.name}</Typography>}
          {imagePreviewUrl && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img src={imagePreviewUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', borderRadius: '8px' }} />
            </Box>
          )}
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
