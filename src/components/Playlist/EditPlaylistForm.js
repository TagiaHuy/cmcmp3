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
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useArtists from '../../hooks/useArtists';
import useSearch from '../../hooks/useSearch'; // Import useSearch
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
  const [selectedArtists, setSelectedArtists] = useState([]);

  const [songSearchQuery, setSongSearchQuery] = useState(''); // State for song search input
  const { results: searchResults, loading: loadingSearchResults } = useSearch(songSearchQuery); // Use useSearch hook

  const { updatePlaylistSongsList, getSongsForPlaylist } = usePlaylists();
  const { artists } = useArtists(); // Integrated useArtists hook

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

    // Initialize selectedArtists from playlist.artists if available
    if (playlist.artists && Array.isArray(playlist.artists)) {
      setSelectedArtists(playlist.artists);
    }
  }, [playlist.id, getSongsForPlaylist, playlist.artists]); // Added playlist.artists to dependency array

  const handleAddSong = async (song) => {
    try {
      await updatePlaylistSongsList(playlist.id, { add: [song.id] });
      setCurrentSongs((prev) => [...prev, song]);
      setSongSearchQuery(''); // Clear search query
      toast.success(`Đã thêm "${song.title}" vào playlist.`);
    } catch (err) {
      console.error('Failed to add song:', err);
      toast.error('Lỗi khi thêm bài hát vào playlist.');
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('privacy', isPrivate ? 'private' : 'public');
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    const artistIds = selectedArtists.map(artist => artist.id).join(',');
    if (artistIds) {
        formData.append('artistIds', artistIds);
    }
    onSubmit(playlist.id, formData);
  };

  if (loadingSongs || loadingSearchResults) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorSongs) { // errorAllSongs removed
    return (
      <Typography color="error" sx={{ py: 4 }}>
        Lỗi: {errorSongs?.message}
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
                  label="Nghệ sĩ liên kết"
              />
          )}
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
      <TextField
        label="Tìm kiếm bài hát"
        variant="outlined"
        fullWidth
        value={songSearchQuery}
        onChange={(e) => setSongSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      {loadingSearchResults && <CircularProgress size={24} />}
      {!loadingSearchResults && searchResults.length > 0 && (
        <List dense>
          {searchResults
            .filter(result => result.type === 'song' && !currentSongs.some(s => s.id === result.id))
            .map((song) => (
              <ListItem
                key={song.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="add" onClick={() => handleAddSong(song)}>
                    <AddIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={<Typography color="text.primary" fontWeight={500}>{song.title}</Typography>}
                  secondary={<Typography color="text.primary" variant="body2">{song.artists}</Typography>}
                />
              </ListItem>
            ))}
        </List>
      )}
      {!loadingSearchResults && songSearchQuery && searchResults.filter(result => result.type === 'song').length === 0 && (
        <Typography variant="body2" color="text.secondary">Không tìm thấy bài hát nào.</Typography>
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
