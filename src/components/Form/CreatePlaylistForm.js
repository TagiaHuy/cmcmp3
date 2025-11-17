import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, TextField, Typography, Modal, IconButton, CircularProgress,
  Autocomplete, List, ListItem, ListItemText, Avatar, ListItemAvatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { createPlaylist, updatePlaylist, addSongsToPlaylist, removeSongFromPlaylist } from '../../services/playlistService';
import { searchSongs } from '../../services/songService';
import { uploadImage } from '../../services/fileService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const CreatePlaylistForm = ({ open, handleClose, initialData, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [playlistImageUrl, setPlaylistImageUrl] = useState(null);
  const [addedSongs, setAddedSongs] = useState([]);
  const [originalSongIds, setOriginalSongIds] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // For Autocomplete
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPlaylistImageUrl(initialData.imageUrl || null);
      // Assuming initialData.songs is an array of song IDs, we need full objects
      // This part is tricky without a getSongsByIds hook. We'll assume it's empty for edit for now.
      // A proper implementation would fetch song details for the initial IDs.
      setAddedSongs(initialData.songs || []); 
      setOriginalSongIds(initialData.songs?.map(s => s.id) || []);
    } else {
      setTitle('');
      setDescription('');
      setPlaylistImageUrl(null);
      setAddedSongs([]);
      setOriginalSongIds([]);
    }
  }, [initialData]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchLoading(true);
      searchSongs(debouncedSearchTerm)
        .then(data => setSearchResults(data))
        .finally(() => setSearchLoading(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleAddSong = (song) => {
    if (song && !addedSongs.find(s => s.id === song.id)) {
      setAddedSongs([...addedSongs, song]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveSong = (songId) => {
    setAddedSongs(addedSongs.filter(s => s.id !== songId));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploadLoading(true);
    try {
      const res = await uploadImage(file);
      setPlaylistImageUrl(res.imageUrl);
      toast.success('Ảnh đã được tải lên!');
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tải ảnh lên.');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const finalSongIds = addedSongs.map(s => s.id);

    try {
      if (isEditMode) {
        await updatePlaylist(initialData.id, { title, description, imageUrl: playlistImageUrl });
        const songsToAdd = finalSongIds.filter(id => !originalSongIds.includes(id));
        const songsToRemove = originalSongIds.filter(id => !finalSongIds.includes(id));

        if (songsToAdd.length > 0) await addSongsToPlaylist(initialData.id, songsToAdd);
        if (songsToRemove.length > 0) {
          await Promise.all(songsToRemove.map(songId => removeSongFromPlaylist(initialData.id, songId)));
        }
        toast.success('Playlist đã được cập nhật!');
      } else {
        const newPlaylist = await createPlaylist({ title, description, imageUrl: playlistImageUrl });
        if (finalSongIds.length > 0) {
          await addSongsToPlaylist(newPlaylist.id, finalSongIds);
        }
        toast.success('Playlist mới đã được tạo!');
      }
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2">{isEditMode ? 'Chỉnh sửa Playlist' : 'Tạo Playlist Mới'}</Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField margin="normal" required fullWidth label="Tên Playlist" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField margin="normal" fullWidth multiline rows={2} label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
          
          <Autocomplete
            sx={{ mt: 2 }}
            freeSolo
            options={searchResults}
            loading={searchLoading}
            getOptionLabel={(option) => option.title || ''}
            onInputChange={(e, newValue) => setSearchTerm(newValue)}
            onChange={(e, newValue) => handleAddSong(newValue)}
            inputValue={searchTerm}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tìm và thêm bài hát..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.title} ({option.artistText})
              </li>
            )}
          />

          <Typography sx={{ mt: 2, mb: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
            {addedSongs.length} bài hát đã được thêm
          </Typography>
          <List dense sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'action.hover', borderRadius: 1, p: 0 }}>
            {addedSongs.map(song => (
              <ListItem
                key={song.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSong(song.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar variant="square" src={song.imageUrl} sx={{ width: 24, height: 24 }} />
                </ListItemAvatar>
                <ListItemText primary={song.title} secondary={song.artistText} primaryTypographyProps={{ fontSize: '0.9rem' }} />
              </ListItem>
            ))}
          </List>

          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }} disabled={imageUploadLoading}>
            {imageUploadLoading ? <CircularProgress size={24} /> : 'Chọn ảnh bìa'}
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
          {playlistImageUrl && <Typography sx={{ mt: 1, fontSize: '0.9rem', color: 'text.secondary' }}>Ảnh đã chọn: {playlistImageUrl.split('/').pop()}</Typography>}
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Lưu thay đổi' : 'Tạo Playlist')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePlaylistForm;
