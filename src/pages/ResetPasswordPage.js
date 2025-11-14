import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/authService';

const ResetPasswordPage = () => {
  console.log('--- ResetPasswordPage component is rendering ---');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Không tìm thấy thông tin email. Vui lòng thử lại từ đầu.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, otp, password);
      toast.success('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

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
          Đặt Lại Mật Khẩu
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="otp"
            label="Mã OTP"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#9353FF' },
                '&:hover fieldset': { borderColor: '#9353FF' },
                '&.Mui-focused fieldset': { borderColor: '#9353FF' },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu mới (tối thiểu 6 ký tự)"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#9353FF' },
                '&:hover fieldset': { borderColor: '#9353FF' },
                '&.Mui-focused fieldset': { borderColor: '#9353FF' },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#9353FF' },
                '&:hover fieldset': { borderColor: '#9353FF' },
                '&.Mui-focused fieldset': { borderColor: '#9353FF' },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2,
              backgroundColor: '#9353FF',
              '&:hover': {
                backgroundColor: '#7A3BCC',
              }
            }}
          >
            {loading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
