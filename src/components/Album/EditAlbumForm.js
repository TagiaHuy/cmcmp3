import React, { useState, useEffect, useRef } from 'react';
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
import CloseIcon from '@mui/icons-material/Close';
import useArtists from '../../hooks/useArtists';
import { useNotifications } from '../../hooks/useNotifications';
import useSearch from '../../hooks/useSearch'; // Import useSearch
import Loading from '../Loading/Loading';
import useUserAlbums from '../../hooks/useUserAlbums';

const EditAlbumForm = ({ album, onSubmit, onCancel }) => {
  const [name, setName] = useState(album.title);
  const [description, setDescription] = useState(album.description || '');
  const [isPrivate, setIsPrivate] = useState(album.privacy === 'PRIVATE');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(album.imageUrl || null);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [errorSongs, setErrorSongs] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifySuccess, notifyError } = useNotifications();

  const [songSearchQuery, setSongSearchQuery] = useState(''); // State for song search input
  const { results: searchResults, loading: loadingSearchResults } = useSearch(songSearchQuery); // Use useSearch hook

  const { updateAlbumSongsList, getSongsForAlbum } = useUserAlbums();
  const { artists } = useArtists(); // Integrated useArtists hook
  const imageInputRef = useRef(null);

  useEffect(() => {
    const fetchCurrentSongs = async () => {
      try {
        setLoadingSongs(true);
        const fetchedCurrentSongs = await getSongsForAlbum(album.id);
        setCurrentSongs(fetchedCurrentSongs);
      } catch (err) {
        if (err?.name !== 'AbortError' && !err.message.includes('401')) {
          setErrorSongs(err);
          notifyError('Lỗi khi tải các bài hát trong album.');
        }
      } finally {
        setLoadingSongs(false);
      }
    };
    fetchCurrentSongs();

    if (album.artists && Array.isArray(album.artists)) {
      setSelectedArtists(album.artists);
    }
  }, [album.id, getSongsForAlbum, album.artists, notifyError]);

  const handleAddSong = async (song) => {
    try {
      await updateAlbumSongsList(album.id, { add: [song.id] });
      setCurrentSongs((prev) => [...prev, song]);
      setSongSearchQuery(''); // Clear search query
      notifySuccess(`Đã thêm "${song.title}" vào album.`);
    } catch (err) {
      console.error('Failed to add song:', err);
      notifyError('Lỗi khi thêm bài hát vào album.');
    }
  };

  const handleRemoveSong = async (songId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài hát này khỏi album không?')) {
      try {
        await updateAlbumSongsList(album.id, { remove: [songId] });
        setCurrentSongs((prev) => prev.filter((s) => s.id !== songId));
      } catch (err) {
        console.error('Failed to remove song:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('privacy', isPrivate ? 'PRIVATE' : 'PUBLIC');
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    const artistIds = selectedArtists.map(artist => artist.id).join(',');
    if (artistIds) {
        formData.append('artistIds', artistIds);
    }
    try {
      await onSubmit(album.id, formData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveImageFile = () => {
    setImageFile(null);
    setImagePreviewUrl(album?.imageUrl || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  if (loadingSongs || loadingSearchResults) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorSongs) {
    return (
      <Typography color="error" sx={{ py: 4 }}>
        Lỗi: {errorSongs?.message}
      </Typography>
    );
  }

  return (
    <>
      {isSubmitting && <Loading />}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxHeight: '70vh',
          overflowY: 'auto',
          flexShrink: 1,
          p: 2,
        }}
      >
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
            disabled={isSubmitting}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          disabled={isSubmitting}
        >
          Chọn ảnh mới
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
              }
            }}
            disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          }
          label={<Typography color="text.primary" fontWeight={600}>Riêng tư</Typography>}
        />

        <Typography variant="h6" mt={2} color="text.primary" fontWeight={600}>Bài hát trong Album</Typography>
        {currentSongs.length === 0 ? (
          <Typography variant="body2" color="text.primary">Chưa có bài hát nào trong album.</Typography>
        ) : (
          <List dense>
            {currentSongs.map((song) => (
              <ListItem
                key={song.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSong(song.id)} disabled={isSubmitting}>
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
          disabled={isSubmitting}
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
                    <IconButton edge="end" aria-label="add" onClick={() => handleAddSong(song)} disabled={isSubmitting}>
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
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EditAlbumForm;