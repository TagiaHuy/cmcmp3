import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ChangePasswordForm = ({ onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword === oldPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu cũ.');
      return;
    }

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

  const passwordFieldSx = {
    'input::-ms-reveal': { display: 'none' },
    'input::-ms-clear': { display: 'none' },
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3, width: '100%' }}>
      <TextField
        label="Mật khẩu cũ"
        type={showOldPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
        sx={passwordFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowOldPassword((show) => !show)}
                edge="end"
              >
                {showOldPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Mật khẩu mới"
        type={showNewPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        sx={passwordFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowNewPassword((show) => !show)}
                edge="end"
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Xác nhận mật khẩu mới"
        type={showConfirmNewPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        required
        sx={passwordFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmNewPassword((show) => !show)}
                edge="end"
              >
                {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
