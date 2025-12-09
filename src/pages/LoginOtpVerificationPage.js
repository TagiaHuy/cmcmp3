import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Container, Paper, Typography } from '@mui/material';
import LoginOtpVerificationForm from '../components/Form/LoginOtpVerificationForm';

const LoginOtpVerificationPage = () => {
  const location = useLocation();
  const { email } = location.state || {};

  // If we don't have the required data, redirect back to the login page
  if (!email) {
    return <Navigate to="/login" replace />;
  }

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
        <Typography component="h1" variant="h5" sx={{ color: (theme) => theme.palette.text.primary, mb: 2 }}>
          Xác thực OTP
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: (theme) => theme.palette.text.secondary }}>
          Một mã OTP đã được gửi đến địa chỉ email của bạn: <strong>{email}</strong>. Vui lòng nhập mã để hoàn tất đăng nhập.
        </Typography>
        <LoginOtpVerificationForm 
          email={email}
        />
      </Paper>
    </Container>
  );
};

export default LoginOtpVerificationPage;
