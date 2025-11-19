import React, { useState } from 'react';
import { Box, Typography, Container, Alert, CircularProgress, Paper } from '@mui/material';
import ChangePasswordForm from '../components/Form/ChangePasswordForm';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/authService';
import { toast } from 'react-toastify';

const ChangePasswordPage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async ({ oldPassword, newPassword }) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!token) {
        setError('Không có token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      await changePassword(token, oldPassword, newPassword);
      setSuccess('Đổi mật khẩu thành công!');
      toast.success('Đổi mật khẩu thành công!');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
      toast.error(err.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
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
          {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{success}</Alert>}
          <ChangePasswordForm onSubmit={handleChangePassword} />
          {loading && <CircularProgress sx={{ mt: 2 }} />}
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangePasswordPage;
