import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Loading from '../Loading/Loading';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';
import { createTag } from '../../services/tagService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CreateTagForm = ({ open, handleClose, onTagCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { notifySuccess, notifyError, notifyWarning } = useNotifications();
  const { user, isAdmin } = useAuth();

  // fallback check admin nếu context chưa expose isAdmin
  const computedIsAdmin = useMemo(() => {
    if (typeof isAdmin === 'boolean') return isAdmin;
    const roles = user?.roles || user?.authorities || [];
    return Array.isArray(roles) && roles.some((r) => String(r).toUpperCase().includes('ADMIN'));
  }, [isAdmin, user]);

  useEffect(() => {
    if (!open) return;
    setName('');
    setDescription('');
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!computedIsAdmin) {
      notifyError('Bạn không có quyền tạo thể loại (chỉ ADMIN).');
      return;
    }

    if (!name.trim()) {
      notifyWarning('Vui lòng nhập tên thể loại.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
      };

      const newTag = await createTag(payload); // ✅ dùng service
      notifySuccess('Tạo thể loại mới thành công!');
      onTagCreated?.(newTag);

      setTimeout(() => {
        handleClose?.();
      }, 500);
    } catch (err) {
      notifyError(`Tạo thể loại thất bại: ${err.message || 'Unknown error'}`);
      console.error('Error creating tag:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="create-tag-modal-title">
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

        <Typography id="create-tag-modal-title" variant="h6" component="h2" color="primary.main">
          Tạo thể loại mới
        </Typography>

        {!computedIsAdmin && (
          <Typography color="error" sx={{ mt: 1 }}>
            Chỉ ADMIN mới có quyền tạo thể loại.
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Tên thể loại"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!computedIsAdmin || isLoading}
          />

          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={3}
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!computedIsAdmin || isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={!computedIsAdmin || isLoading}
          >
            Tạo thể loại
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTagForm;
