// src/pages/Auth/RegisterForm.js
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Divider, Typography,
  IconButton, InputAdornment
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNotifications } from '../../hooks/useNotifications';
import { sendOtp } from '../../services/authService';

const emailRegex = /^[^\s@]+@gmail\.com$/i;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotifications();

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
  };

  const validate = () => {
    const e = { displayName: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!form.displayName.trim()) {
      isValid = false;
    } else if (form.displayName.trim().length < 2) {
      e.displayName = 'Tên hiển thị tối thiểu 2 ký tự';
      isValid = false;
    }

    const email = form.email.trim();
    if (!email) {
      isValid = false;
    } else if (!emailRegex.test(email)) {
      e.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!form.password) {
      isValid = false;
    } else if (form.password.length < 6) {
      e.password = 'Mật khẩu tối thiểu 6 ký tự';
      isValid = false;
    }

    if (!form.confirmPassword) {
      isValid = false;
    } else if (form.confirmPassword !== form.password) {
      e.confirmPassword = 'Mật khẩu không khớp';
      isValid = false;
    }

    setFieldErr(e);
    return isValid;
  };

  const focusFirstError = (e) => { // Keep this for other errors
    for (const k of ['displayName', 'email', 'password', 'confirmPassword']) {
      if (e[k]) { refs[k].current?.focus(); break; }
    }
  };

  const onBlurValidate = () => validate(); // This will not show errors for empty fields on blur anymore


  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentErrors = validate(); // Call validate to update fieldErr state
    // Now check if there are any error messages or if isValid is false from validate
    if (!currentErrors) { // If validate returns false (meaning something is invalid or empty)
        // Optionally, if you still want to focus on the first truly invalid field,
        // you would need to re-evaluate 'e' here based on current state after setFieldErr.
        // For now, based on user request, we just prevent submission without
        // displaying "Vui lòng nhập" for empty fields.
        return;
    }

    setSubmitting(true);
    try {
      const { displayName, email, password } = form;
      await sendOtp(email.trim());
      notifySuccess('Mã OTP đã được gửi đến email của bạn.');
      navigate('/verify-otp', {
        state: {
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        },
      });
    } catch (err) {
      notifyError(err?.message || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

const handleGoogleLogin = () => {
    const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    window.location.href = `${API_URL}/oauth2/authorization/google`;
  };

  const errorFieldSx = {
    '& .MuiOutlinedInput-root.Mui-error fieldset': {
      borderColor: 'error.main',
      borderWidth: 2,
    },
    'input::-ms-reveal': { display: 'none' },
    'input::-ms-clear': { display: 'none' },
  };
  const helperTextProps = { sx: { color: 'error.main', fontSize: '14px', fontWeight: 600 } };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }} noValidate>
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
