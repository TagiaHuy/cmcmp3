import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
      navigate('/reset-password', { state: { email } });
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
          Quên Mật Khẩu
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: (theme) => theme.palette.text.secondary, textAlign: 'center' }}>
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu.
        </Typography>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#9353FF',
                },
                '&:hover fieldset': {
                  borderColor: '#9353FF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9353FF',
                },
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
            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#9353FF', textDecoration: 'none' }}>
              Quay lại Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
