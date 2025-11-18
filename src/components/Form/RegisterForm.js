// src/pages/Auth/RegisterForm.js
import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Divider, Typography,
  IconButton, InputAdornment
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { sendOtp } from '../../services/authService';
import { toast } from 'react-toastify';

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
    otp: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const refs = {
    displayName: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    otp: useRef(null),
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'otp') {
      setOtp(value);
      setFieldErr((err) => ({ ...err, otp: '' }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
      setFieldErr((err) => ({ ...err, [name]: '' }));
    }
  };

  const validate = () => {
    const e = { displayName: '', email: '', password: '', confirmPassword: '', otp: '' };

    if (!form.displayName.trim()) e.displayName = 'Vui lòng nhập tên hiển thị';
    else if (form.displayName.trim().length < 2) e.displayName = 'Tên hiển thị tối thiểu 2 ký tự';

    const email = form.email.trim();
    if (!email) e.email = 'Vui lòng nhập email';
    else if (!emailRegex.test(email)) e.email = 'Email không hợp lệ';

    if (isOtpSent && !otp.trim()) e.otp = 'Vui lòng nhập mã OTP';

    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';

    if (!form.confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Mật khẩu không khớp';

    setFieldErr(e);
    return e;
  };

  const focusFirstError = (e) => {
    for (const k of ['displayName', 'email', 'otp', 'password', 'confirmPassword']) {
      if (e[k]) { refs[k].current?.focus(); break; }
    }
  };

  const handleSendOtp = async () => {
    const email = form.email.trim();
    if (!email || !emailRegex.test(email)) {
      setFieldErr(e => ({ ...e, email: 'Email không hợp lệ' }));
      refs.email.current?.focus();
      return;
    }

    setIsVerifying(true);
    try {
      await sendOtp(email);
      setIsOtpSent(true);
      toast.success('Mã OTP đã được gửi đến email của bạn.');
    } catch (error) {
      toast.error(error?.message || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setIsVerifying(false);
    }
  };

  const onBlurValidate = () => validate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const e = validate();
    if (Object.values(e).some(Boolean)) {
      focusFirstError(e);
      return;
    }

    try {
      setSubmitting(true);
      await register(form.displayName.trim(), form.email.trim(), form.password, otp);
      toast.success('Đăng ký thành công! Bạn sẽ được chuyển tới trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errorMessage = err?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      if (errorMessage.includes('OTP không hợp lệ') || errorMessage.includes('OTP đã hết hạn')) {
        toast.error('mã OTP không hợp lệ');
      } else if (errorMessage.includes('Email đã được sử dụng')) {
        setFieldErr(e => ({ ...e, email: 'Tài khoản này đã được sử dụng' }));
        refs.email.current?.focus();
      } else {
        toast.error(errorMessage);
      }
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

      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
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
          sx={{ ...errorFieldSx, flexGrow: 1 }}
          disabled={isOtpSent}
        />
        <Button
          variant="contained"
          onClick={handleSendOtp}
          disabled={isVerifying || isOtpSent}
          sx={{
            mt: '16px', // Match TextField margin
            height: '56px', // Match TextField height
            flexShrink: 0,
          }}
        >
          {isVerifying ? 'Đang gửi...' : 'Gửi OTP'}
        </Button>
      </Box>

      {isOtpSent && (
        <TextField
          margin="normal"
          required
          fullWidth
          id="otp"
          label="Mã OTP"
          name="otp"
          inputRef={refs.otp}
          value={otp}
          onChange={onChange}
          onBlur={onBlurValidate}
          error={!!fieldErr.otp}
          helperText={fieldErr.otp}
          helperTextProps={helperTextProps}
          sx={errorFieldSx}
        />
      )}

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
