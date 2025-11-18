import React, { useState } from 'react';
import { Box, TextField, Button, FormControlLabel, Switch, Typography } from '@mui/material';

const CreatePlaylistForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, privacy: isPrivate ? 'private' : 'public' });
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Tạo
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePlaylistForm;
