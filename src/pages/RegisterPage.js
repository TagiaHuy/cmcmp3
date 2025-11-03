import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import RegisterForm from '../components/Form/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
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
          Đăng Ký
        </Typography>
        <RegisterForm />
        <Typography variant="body2" sx={{ mt: 2, color: (theme) => theme.palette.text.secondary }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#9353FF', textDecoration: 'none' }}>
            Đăng nhập
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
