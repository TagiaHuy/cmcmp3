import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import LoginForm from '../components/Form/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={6}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: '12px',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: (theme) => theme.palette.text.primary }}>
          Đăng Nhập
        </Typography>
        <LoginForm />
        <Typography variant="body2" sx={{ mt: 2, color: (theme) => theme.palette.text.secondary }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#9353FF', textDecoration: 'none' }}>
            Đăng ký ngay
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
