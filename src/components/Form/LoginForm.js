// src/pages/Auth/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box, TextField, Button, Divider, Typography, Alert,
  IconButton, InputAdornment
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const emailRegex = /^[^\s@]+@gmail\.com$/i;

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErr, setFieldErr] = useState({ email: '', password: '' });
  const [submitErr, setSubmitErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setFieldErr((err) => ({ ...err, [key]: '' })); // clear lỗi khi người dùng sửa
    setSubmitErr('');
  };

  const validate = () => {
    const e = { email: '', password: '' };

    const email = form.email.trim();
    if (!email) e.email = 'Vui lòng nhập email';
    else if (!emailRegex.test(email)) e.email = 'Email không hợp lệ';

    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';

    setFieldErr(e);
    return !e.email && !e.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitErr('');

    if (!validate()) return;

    try {
      setSubmitting(true);
      await login(form.email.trim(), form.password);
      navigate('/'); // chuyển về trang chủ khi đăng nhập thành công
    } catch (err) {
      const msg =
        /401/.test(err.message) ? 'Email hoặc mật khẩu không đúng'
        : /403/.test(err.message) ? 'Bạn không có quyền truy cập'
        : err.message || 'Đăng nhập thất bại';
      setSubmitErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // style lỗi: helperText đỏ đậm + viền đỏ dày; ẩn mắt mặc định Edge/IE
  const errorFieldSx = {
    '& .MuiOutlinedInput-root.Mui-error fieldset': {
      borderColor: 'error.main',
      borderWidth: 2,
    },
    'input::-ms-reveal': { display: 'none' },
    'input::-ms-clear': { display: 'none' },
  };
  const helperTextProps = { sx: { color: 'error.main', fontSize: '14px', fontWeight: 600 } };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }} noValidate>
      {submitErr && <Alert severity="error" sx={{ mb: 2 }}>{submitErr}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Địa chỉ Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={form.email}
        onChange={onChange('email')}
        onBlur={validate}
        error={!!fieldErr.email}
        helperText={fieldErr.email}
        helperTextProps={helperTextProps}
        sx={errorFieldSx}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        name="password"
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        value={form.password}
        onChange={onChange('password')}
        onBlur={validate}
        error={!!fieldErr.password}
        helperText={fieldErr.password}
        helperTextProps={helperTextProps}
        sx={errorFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={submitting}
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: (theme) => theme.Button?.highlightButtonBackground || undefined,
          '&:hover': {
            backgroundColor: (theme) => theme.Button?.highlightButtonHoverBackground || undefined
          }
        }}
      >
        {submitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
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
          backgroundColor: '#4285F4',
          backgroundImage: 'linear-gradient(to right, #4285F4, #DB4437, #F4B400, #0F9D58)',
          backgroundSize: '200% auto',
          transition: 'background-position 0.5s ease-out',
          '&:hover': { backgroundPosition: 'right center' }
        }}
      >
        Đăng nhập với Google
      </Button>
    </Box>
  );
};

export default LoginForm;
