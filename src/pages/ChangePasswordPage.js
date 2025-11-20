import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Alert, CircularProgress, Paper } from '@mui/material';
import ChangePasswordForm from '../components/Form/ChangePasswordForm';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { changePassword } from '../services/authService';

const ChangePasswordPage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { notifySuccess, notifyError } = useNotifications();

  const handleChangePassword = async ({ oldPassword, newPassword }) => {
    setLoading(true);
    setError('');
    try {
      if (!token) {
        setError('Không có token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      await changePassword(token, oldPassword, newPassword);
      notifySuccess('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
      notifyError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary" fontWeight={600}>
          Đổi mật khẩu
        </Typography>
        <Paper sx={{ padding: 4, backgroundColor: (theme) => theme.palette.background.paper, width: '100%' }}>
          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
          <ChangePasswordForm onSubmit={handleChangePassword} />
          {loading && <CircularProgress sx={{ mt: 2 }} />}
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangePasswordPage;
