import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import OtpVerificationForm from '../components/Form/OtpVerificationForm';

const OtpVerificationPage = () => {
  const location = useLocation();
  const { displayName, email, password } = location.state || {};

  // If we don't have the required data, redirect back to the register page
  if (!email || !displayName || !password) {
    return <Navigate to="/register" replace />;
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
          Một mã OTP đã được gửi đến địa chỉ email của bạn: <strong>{email}</strong>. Vui lòng nhập mã để hoàn tất đăng ký.
        </Typography>
        <OtpVerificationForm 
          displayName={displayName}
          email={email}
          password={password} 
        />
      </Paper>
    </Container>
  );
};

export default OtpVerificationPage;

