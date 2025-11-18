import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useArtists from '../../hooks/useArtists';
import useTags from '../../hooks/useTags';
import Loading from '../Loading/Loading';
import { updateUploadedSong } from '../../services/songService';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const EditSongForm = ({ open, handleClose, song, onUpdated }) => {
  const { artists: artistOptions } = useArtists();
  const { tags: tagOptions } = useTags();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [songFile, setSongFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && song) {
      setTitle(song.title || '');
      setDescription(song.description || '');
      setSelectedArtists(song.artistEntities || []);
      setSelectedTags(song.tagEntities || song.tags || []);
      setSongFile(null);
      setImageFile(null);
      setImagePreviewUrl(song.imageUrl || null);
    }
    if (!open) {
      setSongFile(null);
      setImageFile(null);
    }
  }, [song, open]);

  const disabled = !song;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) return;

    if (!title.trim()) {
      toast.warn('Tên bài hát không được để trống.');
      return;
    }
    if (!selectedArtists.length) {
      toast.warn('Vui lòng chọn ít nhất một nghệ sĩ.');
      return;
    }
    if (!selectedTags.length) {
      toast.warn('Vui lòng chọn ít nhất một thể loại.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description || '');

    const artistIds = selectedArtists.map((artist) => artist.id).filter(Boolean);
    const tagIds = selectedTags.map((tag) => tag.id).filter(Boolean);

    if (artistIds.length) {
      formData.append('artistIds', artistIds.join(','));
    }
    if (tagIds.length) {
      formData.append('tagIds', tagIds.join(','));
    }
    if (songFile) {
      formData.append('songFile', songFile);
    }
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    try {
      setIsLoading(true);
      const updatedSong = await updateUploadedSong(song.id, formData);
      toast.success('Cập nhật bài hát thành công!');
      onUpdated?.(updatedSong);
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Cập nhật bài hát thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-song-modal-title"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
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
        <Typography id="edit-song-modal-title" variant="h6" component="h2" color="primary.main">
          Chỉnh sửa bài hát
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Tên bài hát"
          name="title"
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
          id="artist-edit-select"
          options={artistOptions}
          getOptionLabel={(option) => option?.name || ''}
          value={selectedArtists}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => setSelectedArtists(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              fullWidth
              label="Nghệ sĩ"
            />
          )}
        />

        <Autocomplete
          multiple
          id="tag-edit-select"
          options={tagOptions}
          getOptionLabel={(option) => option?.name || ''}
          value={selectedTags}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => setSelectedTags(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              fullWidth
              label="Thể loại"
            />
          )}
        />

        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Thay tệp bài hát (MP3)
          <input
            type="file"
            hidden
            accept=".mp3"
            onChange={(e) => setSongFile(e.target.files[0])}
          />
        </Button>
        {songFile && <Typography sx={{ mt: 1 }}>{songFile.name}</Typography>}

        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Thay ảnh bài hát
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
                setImagePreviewUrl(song?.imageUrl || null);
              }
            }}
          />
        </Button>
        {imageFile && (
          <Typography sx={{ mt: 1 }}>
            {imageFile.name}
          </Typography>
        )}

        {imagePreviewUrl && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img
              src={imagePreviewUrl}
              alt="Song artwork preview"
              style={{ maxWidth: '100%', height: 'auto', maxHeight: 200, borderRadius: 8 }}
            />
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={disabled}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Modal>
  );
};

export default EditSongForm;

