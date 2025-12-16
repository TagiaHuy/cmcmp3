import React, { useEffect, useState, useRef } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNotifications } from '../../hooks/useNotifications';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import useArtists from '../../hooks/useArtists';
import Loading from '../Loading/Loading';
import { updateAlbum } from '../../services/albumService';
import { getUploadedSongs } from '../../services/songService';
import useUserAlbums from '../../hooks/useUserAlbums';

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

const EditAlbumForm = ({ open, handleClose, album, onUpdated }) => {
  const { artists: artistOptions } = useArtists();
  const { notifySuccess, notifyError, notifyWarning } = useNotifications();
  const { updateAlbumSongsList, getSongsForAlbum } = useUserAlbums(); // For song management

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for song management within album
  const [currentSongs, setCurrentSongs] = useState([]);
  const [loadingCurrentSongs, setLoadingCurrentSongs] = useState(false);
  const [errorCurrentSongs, setErrorCurrentSongs] = useState(null);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [loadingSongSearch, setLoadingSongSearch] = useState(false);

  const imageInputRef = useRef(null);

  // Effect to populate form state when album changes
  useEffect(() => {
    if (open && album) {
      setName(album.title || '');
      setDescription(album.description || '');
      setSelectedArtists(album.artistEntities || []);
      setImageFile(null);
      setImagePreviewUrl(album.imageUrl || null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      
      // Reset song search on modal open
      setSongSearchQuery('');
      setSongSearchResults([]);
    } else if (!open) {
      // Reset form when modal closes
      setName('');
      setDescription('');
      setSelectedArtists([]);
      setImageFile(null);
      setImagePreviewUrl(null);
      setSongSearchQuery('');
      setSongSearchResults([]);
      setCurrentSongs([]);
    }
  }, [album, open]);

  // Effect for debounced song search
  useEffect(() => {
    if (!songSearchQuery) {
      setSongSearchResults([]);
      return;
    }

    setLoadingSongSearch(true);
    const handler = setTimeout(() => {
      const ac = new AbortController();
      getUploadedSongs(songSearchQuery, ac.signal)
        .then(results => setSongSearchResults(results))
        .catch(err => {
          if (err.name !== 'AbortError') notifyError("Lỗi khi tìm kiếm bài hát của bạn.");
        })
        .finally(() => setLoadingSongSearch(false));
      
      return () => ac.abort();
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [songSearchQuery, notifyError]);

  // Effect to fetch current songs in the album
  useEffect(() => {
    if (!open || !album) { // Only fetch if modal is open and album is valid
      setCurrentSongs([]);
      setLoadingCurrentSongs(false);
      return;
    }
    const fetchCurrentSongs = async () => {
      try {
        setLoadingCurrentSongs(true);
        const fetchedCurrentSongs = await getSongsForAlbum(album.id);
        setCurrentSongs(fetchedCurrentSongs);
      } catch (err) {
        if (err?.name !== 'AbortError' && !err.message.includes('401')) {
          setErrorCurrentSongs(err);
          notifyError('Lỗi khi tải các bài hát trong album.');
        }
      } finally {
        setLoadingCurrentSongs(false);
      }
    };
    fetchCurrentSongs();
  }, [album, open, getSongsForAlbum, notifyError]);

  const disabled = !album;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) return;

    if (!name.trim()) {
      notifyWarning('Tên album không được để trống.');
      return;
    }

    const formData = new FormData();
    formData.append('title', name.trim());
    formData.append('description', description || '');
    
    const artistIds = selectedArtists.map((artist) => artist.id).filter(Boolean);
    if (artistIds.length) {
      formData.append('artistIds', artistIds.join(','));
    }
    
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    try {
      setIsLoading(true);
      const updatedAlbum = await updateAlbum(album.id, formData);
      notifySuccess('Cập nhật album thành công!');
      onUpdated?.(updatedAlbum);
      handleClose();
    } catch (error) {
      notifyError(error.message || 'Cập nhật album thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImageFile = () => {
    setImageFile(null);
    setImagePreviewUrl(album?.imageUrl || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Handlers for song management
  const handleAddSong = async (songToAdd) => {
    if (album && songToAdd) {
      try {
        await updateAlbumSongsList(album.id, { add: [songToAdd.id] });
        setCurrentSongs((prev) => [...prev, songToAdd]);
        setSongSearchQuery('');
        setSongSearchResults([]);
        notifySuccess(`Đã thêm "${songToAdd.title}" vào album.`);
      } catch (err) {
        console.error('Failed to add song:', err);
        notifyError(err.message || 'Lỗi khi thêm bài hát vào album.');
      }
    }
  };

  const handleRemoveSong = async (songId) => {
    if (album && window.confirm('Bạn có chắc chắn muốn xóa bài hát này khỏi album không?')) {
      try {
        await updateAlbumSongsList(album.id, { remove: [songId] });
        setCurrentSongs((prev) => prev.filter((s) => s.id !== songId));
        notifySuccess('Đã xóa bài hát khỏi album.');
      } catch (err) {
        console.error('Failed to remove song:', err);
        notifyError(err.message || 'Lỗi khi xóa bài hát khỏi album.');
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-album-modal-title"
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
        <Typography id="edit-album-modal-title" variant="h6" component="h2" color="primary.main">
          Chỉnh sửa Album
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Tên Album"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Mô tả"
          name="description"
          multiline
          rows={4}
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

        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Thay ảnh bìa
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
              } else {
                setImagePreviewUrl(album?.imageUrl || null);
              }
            }}
          />
        </Button>
        {imageFile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography sx={{ flexGrow: 1 }} noWrap>{imageFile.name}</Typography>
            <IconButton onClick={handleRemoveImageFile} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {imagePreviewUrl && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img
              src={imagePreviewUrl}
              alt="Album cover preview"
              style={{ maxWidth: '100%', height: 'auto', maxHeight: 200, borderRadius: 8 }}
            />
          </Box>
        )}

        {/* Song Management Section */}
        <Typography variant="h6" mt={3} color="text.primary">Bài hát trong Album</Typography>
        {loadingCurrentSongs && <CircularProgress size={20} />}
        {errorCurrentSongs && <Typography color="error">{errorCurrentSongs.message}</Typography>}
        {!loadingCurrentSongs && currentSongs.length === 0 ? (
          <Typography variant="body2">Chưa có bài hát nào trong album.</Typography>
        ) : (
          <List dense>
            {currentSongs.map((song) => (
              <ListItem
                key={song.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSong(song.id)} disabled={isLoading}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={song.title} secondary={song.artists} primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
            ))}
          </List>
        )}

        <Typography variant="h6" mt={3} color="text.primary">Thêm bài hát</Typography>
        <TextField
          label="Tìm kiếm bài hát của bạn"
          variant="outlined"
          fullWidth
          value={songSearchQuery}
          onChange={(e) => setSongSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />
        {loadingSongSearch && <CircularProgress size={24} />}
        {!loadingSongSearch && songSearchQuery && songSearchResults.length > 0 && (
          <List dense>
            {songSearchResults
              .filter(song => !currentSongs.some(s => s.id === song.id)) // Filter out already added songs
              .map((song) => (
                <ListItem
                  key={song.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="add" onClick={() => handleAddSong(song)} disabled={isLoading}>
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={song.title} secondary={song.artists} primaryTypographyProps={{ color: 'white' }} />
                </ListItem>
              ))}
          </List>
        )}
        {!loadingSongSearch && songSearchQuery && songSearchResults.length === 0 && (
          <Typography variant="body2" color="text.secondary">Không tìm thấy bài hát nào.</Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={disabled || isLoading}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Modal>
  );
};

export default EditAlbumForm;