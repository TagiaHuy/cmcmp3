import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  FormGroup,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useSongs from '../../hooks/useSongs';
import { toast } from 'react-toastify';
import usePlaylists from '../../hooks/usePlaylists';

const EditPlaylistForm = ({ playlist, onSubmit, onCancel }) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || '');
  const [isPrivate, setIsPrivate] = useState(playlist.privacy === 'private');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(playlist.imageUrl || null);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [errorSongs, setErrorSongs] = useState(null);
  const [selectedSongsToAdd, setSelectedSongsToAdd] = useState([]);

  const { updatePlaylistSongsList, getSongsForPlaylist } = usePlaylists();
  const { songs: allSongs, loading: loadingAllSongs, error: errorAllSongs } = useSongs();

  useEffect(() => {
    const fetchCurrentSongs = async () => {
      try {
        setLoadingSongs(true);
        const fetchedCurrentSongs = await getSongsForPlaylist(playlist.id);
        setCurrentSongs(fetchedCurrentSongs);
      } catch (err) {
        if (err?.name !== 'AbortError' && !err.message.includes('401')) {
          setErrorSongs(err);
          toast.error('Lỗi khi tải các bài hát trong playlist.');
        }
      } finally {
        setLoadingSongs(false);
      }
    };
    fetchCurrentSongs();
  }, [playlist.id, getSongsForPlaylist]);

  const handleRemoveSong = async (songId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài hát này khỏi playlist không?')) {
      try {
        await updatePlaylistSongsList(playlist.id, { remove: [songId] });
        setCurrentSongs((prev) => prev.filter((s) => s.id !== songId));
      } catch (err) {
        console.error('Failed to remove song:', err);
      }
    }
  };

  const handleAddSelectedSongs = async () => {
    if (selectedSongsToAdd.length === 0) {
      toast.info('Vui lòng chọn bài hát để thêm.');
      return;
    }
    try {
      await updatePlaylistSongsList(playlist.id, { add: selectedSongsToAdd });
      const addedSongs = allSongs.filter(song => selectedSongsToAdd.includes(song.id));
      setCurrentSongs((prev) => [...prev, ...addedSongs]);
      setSelectedSongsToAdd([]); // Clear selection
      toast.success('Đã thêm bài hát vào playlist.');
    } catch (err) {
      console.error('Failed to add songs:', err);
    }
  };

  const handleToggleSongToAdd = (songId) => {
    setSelectedSongsToAdd((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('privacy', isPrivate ? 'private' : 'public');
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    onSubmit(playlist.id, formData);
  };

  const availableSongs = allSongs.filter(
    (song) => !currentSongs.some((current) => current.id === song.id)
  );

  if (loadingSongs || loadingAllSongs) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorSongs || errorAllSongs) {
    return (
      <Typography color="error" sx={{ py: 4 }}>
        Lỗi: {errorSongs?.message || errorAllSongs?.message}
      </Typography>
    );
  }

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
        Chọn ảnh mới
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              setImagePreviewUrl(URL.createObjectURL(file));
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

      <Typography variant="h6" mt={2} color="text.primary" fontWeight={600}>Bài hát trong Playlist</Typography>
      {currentSongs.length === 0 ? (
        <Typography variant="body2" color="text.primary">Chưa có bài hát nào trong playlist.</Typography>
      ) : (
        <List dense>
          {currentSongs.map((song) => (
            <ListItem
              key={song.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSong(song.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={<Typography color="text.primary" fontWeight={500}>{song.title}</Typography>}
                secondary={<Typography color="text.primary" variant="body2">{song.artistName}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Typography variant="h6" mt={2} color="text.primary" fontWeight={600}>Thêm bài hát</Typography>
      {availableSongs.length === 0 ? (
        <Typography variant="body2" color="text.primary">Không có bài hát nào để thêm.</Typography>
      ) : (
        <FormGroup>
          {availableSongs.map((song) => (
            <FormControlLabel
              key={song.id}
              control={
                <Checkbox
                  checked={selectedSongsToAdd.includes(song.id)}
                  onChange={() => handleToggleSongToAdd(song.id)}
                />
              }
              label={<Typography color="text.primary">{`${song.title} - ${song.artistName}`}</Typography>}
            />
          ))}
        </FormGroup>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        <Button variant="outlined" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
};

export default EditPlaylistForm;
