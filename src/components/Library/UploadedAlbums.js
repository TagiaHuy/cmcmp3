import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import CreateAlbumForm from '../Album/CreateAlbumForm';
import EditAlbumForm from '../Album/EditAlbumForm';
import AlbumList from '../Album/AlbumList';
import { getAlbumsMe, deleteAlbum } from '../../services/albumService';
import { useNotifications } from '../../hooks/useNotifications';

const UploadedAlbums = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const { notifySuccess, notifyError } = useNotifications();

  const fetchUploadedAlbums = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const uploadedAlbums = await getAlbumsMe(signal); 
      setAlbums(uploadedAlbums || []);
    } catch (e) {
      if (e?.name !== 'AbortError') {
        setError('Không thể tải danh sách album đã tạo.');
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchUploadedAlbums(ac.signal);
    return () => ac.abort();
  }, [fetchUploadedAlbums]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Refresh the list after creation
    const ac = new AbortController();
    fetchUploadedAlbums(ac.signal);
  };

  const handleEditClick = (album) => {
    setEditingAlbum(album);
  };

  const handleEditClose = () => {
    setEditingAlbum(null);
  };

  const handleAlbumUpdated = (updatedAlbum) => {
    setAlbums((prev) =>
      prev.map((album) => (album.id === updatedAlbum.id ? updatedAlbum : album))
    );
    // also refetch to be sure
    const ac = new AbortController();
    fetchUploadedAlbums(ac.signal);
  };

  const handleDeleteAlbum = async (albumId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa album này? Tất cả bài hát trong album sẽ không bị ảnh hưởng.');
    if (!confirmed) {
      return;
    }

    try {
      await deleteAlbum(albumId);
      setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== albumId));
      notifySuccess('Xóa album thành công!');
    } catch (err) {
      notifyError(err.message || 'Lỗi khi xóa album.');
    }
  };

  const renderAlbumActions = (album) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        size="small"
        color="primary"
        onClick={() => handleEditClick(album)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDeleteAlbum(album.id)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Đang tải danh sách album của bạn...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (albums.length === 0) {
      return (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderStyle: 'dashed',
          }}
        >
          <LibraryMusicIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Chưa có album nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hãy tạo album đầu tiên để sắp xếp bộ sưu tập của bạn.
          </Typography>
          <Button startIcon={<AddPhotoAlternateIcon />} variant="contained" onClick={handleOpenModal}>
            Tạo album đầu tiên
          </Button>
        </Paper>
      );
    }

    return <AlbumList albums={albums} renderActions={renderAlbumActions} />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.06))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Album đã tạo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý và chỉnh sửa các album cá nhân của bạn.
            </Typography>
          </Box>
          <Button startIcon={<AddPhotoAlternateIcon />} variant="contained" onClick={handleOpenModal}>
            Tạo album mới
          </Button>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        {renderContent()}
      </Paper>

      <CreateAlbumForm open={modalOpen} handleClose={handleCloseModal} onCreated={handleAlbumUpdated} />
      <EditAlbumForm
        open={Boolean(editingAlbum)}
        handleClose={handleEditClose}
        album={editingAlbum}
        onUpdated={handleAlbumUpdated}
      />
    </Box>
  );
};

export default UploadedAlbums;
