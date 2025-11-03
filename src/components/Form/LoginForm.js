import React, { useState } from 'react';
import { Box, TextField, Button, Divider, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    console.log("Simulating Google Login...");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login submitted with:", { email, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Địa chỉ Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Mật khẩu"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ 
          mt: 3, 
          mb: 2,
          backgroundColor: (theme) => theme.Button.highlightButtonBackground,
          '&:hover': {
            backgroundColor: (theme) => theme.Button.highlightButtonHoverBackground
          }
        }}
      >
        Đăng Nhập
      </Button>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>HOẶC</Typography>
      </Divider>
      <Button
        fullWidth
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        sx={{
          color: 'white',
          backgroundColor: '#4285F4', // Fallback color
          backgroundImage: 'linear-gradient(to right, #4285F4, #DB4437, #F4B400, #0F9D58)',
          backgroundSize: '200% auto',
          transition: 'background-position 0.5s ease-out',
          '&:hover': {
            backgroundPosition: 'right center', // Change the gradient direction on hover
          }
        }}
      >
        Đăng nhập với Google
      </Button>
    </Box>
  );
};

export default LoginForm;
