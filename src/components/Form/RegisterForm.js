// src/pages/Auth/RegisterForm.js
import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Divider, Typography, Alert,
  IconButton, InputAdornment
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const emailRegex = /^[^\s@]+@gmail\.com$/i;

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErr, setFieldErr] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitErr, setSubmitErr] = useState('');   // chỉ dùng cho lỗi từ BE
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const refs = {
    displayName: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setFieldErr((err) => ({ ...err, [name]: '' }));
    setSubmitErr('');
    setSuccessMsg('');
  };

  const validate = () => {
    const e = { displayName: '', email: '', password: '', confirmPassword: '' };

    if (!form.displayName.trim()) e.displayName = 'Vui lòng nhập tên hiển thị';
    else if (form.displayName.trim().length < 2) e.displayName = 'Tên hiển thị tối thiểu 2 ký tự';

    const email = form.email.trim();
    if (!email) e.email = 'Vui lòng nhập email';
    else if (!emailRegex.test(email)) e.email = 'Email không hợp lệ';

    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';

    if (!form.confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Mật khẩu không khớp';

    setFieldErr(e);
    return e;
  };

  const focusFirstError = (e) => {
    for (const k of ['displayName', 'email', 'password', 'confirmPassword']) {
      if (e[k]) { refs[k].current?.focus(); break; }
    }
  };

  const onBlurValidate = () => validate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitErr('');
    setSuccessMsg('');

    const e = validate();
    if (Object.values(e).some(Boolean)) {
      // ❌ Không còn setSubmitErr(...) để hiện dòng cảnh báo tổng
      focusFirstError(e);
      return;
    }

    try {
      setSubmitting(true);
      await register(form.displayName.trim(), form.email.trim(), form.password);
      setSuccessMsg('Đăng ký thành công! Bạn sẽ được chuyển tới trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setSubmitErr(err?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const errorFieldSx = {
    '& .MuiOutlinedInput-root.Mui-error fieldset': {
      borderColor: 'error.main',
      borderWidth: 2,
    },
    // Ẩn icon mắt mặc định của Edge/IE để không bị trùng với icon MUI
    'input::-ms-reveal': { display: 'none' },
    'input::-ms-clear': { display: 'none' },
  };
  const helperTextProps = { sx: { color: 'error.main', fontSize: '14px', fontWeight: 600 } };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }} noValidate>
      {/* chỉ còn hiển thị lỗi từ BE */}
      {submitErr && <Alert severity="error" sx={{ mb: 2 }}>{submitErr}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        id="displayName"
        label="Tên hiển thị"
        name="displayName"
        autoComplete="name"
        inputRef={refs.displayName}
        value={form.displayName}
        onChange={onChange}
        onBlur={onBlurValidate}
        error={!!fieldErr.displayName}
        helperText={fieldErr.displayName}
        helperTextProps={helperTextProps}
        autoFocus
        sx={errorFieldSx}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Địa chỉ Email"
        name="email"
        autoComplete="email"
        inputRef={refs.email}
        value={form.email}
        onChange={onChange}
        onBlur={onBlurValidate}
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
        autoComplete="new-password"
        inputRef={refs.password}
        value={form.password}
        onChange={onChange}
        onBlur={onBlurValidate}
        error={!!fieldErr.password}
        helperText={fieldErr.password}
        helperTextProps={helperTextProps}
        sx={errorFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(s => !s)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="confirmPassword"
        name="confirmPassword"
        label="Xác nhận Mật khẩu"
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        inputRef={refs.confirmPassword}
        value={form.confirmPassword}
        onChange={onChange}
        onBlur={onBlurValidate}
        error={!!fieldErr.confirmPassword}
        helperText={fieldErr.confirmPassword}
        helperTextProps={helperTextProps}
        sx={errorFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(s => !s)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
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
          backgroundColor: (theme) => theme.Button?.highlightButtonBackground || '#6c3cff',
          '&:hover': {
            backgroundColor: (theme) => theme.Button?.highlightButtonHoverBackground || '#5a2ee6'
          }
        }}
      >
        {submitting ? 'Đang đăng ký...' : 'Đăng Ký'}
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

export default RegisterForm;
