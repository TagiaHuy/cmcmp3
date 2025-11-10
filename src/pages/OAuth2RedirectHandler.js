import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const OAuth2RedirectHandler = () => {
  const { handleSocialLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      handleSocialLogin(token);
      navigate('/');
    } else if (error) {
      // Handle error from backend if any
      console.error("OAuth2 Error:", error);
      navigate('/login', { state: { error: error } });
    } else {
      // No token or error, redirect to login
      navigate('/login');
    }
  }, [handleSocialLogin, location, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Đang xử lý đăng nhập...</Typography>
    </Box>
  );
};

export default OAuth2RedirectHandler;
