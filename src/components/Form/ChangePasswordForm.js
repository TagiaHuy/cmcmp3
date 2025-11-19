import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ChangePasswordForm = ({ onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu mới không khớp.');
      return;
    }

    if (newPassword.length < 6) { // Example validation
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    onSubmit({ oldPassword, newPassword });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3, width: '100%' }}>
      <TextField
        label="Mật khẩu cũ"
        type="password"
        variant="outlined"
        fullWidth
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <TextField
        label="Mật khẩu mới"
        type="password"
        variant="outlined"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextField
        label="Xác nhận mật khẩu mới"
        type="password"
        variant="outlined"
        fullWidth
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        required
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#9353FF', '&:hover': { bgcolor: '#7a42cc' } }}>
        Đổi mật khẩu
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;
