import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';
import { verifyLoginOtp } from '../../services/authService';

const LoginOtpVerificationForm = ({ email }) => {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotifications();

  const [otp, setOtp] = useState('');
  const [fieldErr, setFieldErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const otpRef = useRef(null);

  const onChange = (e) => {
    setOtp(e.target.value);
    setFieldErr('');
  };

  const validate = () => {
    if (!otp.trim()) {
      setFieldErr('Vui lòng nhập mã OTP');
      return false;
    }
    if (otp.trim().length !== 6) {
      setFieldErr('Mã OTP phải có đúng 6 chữ số');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      otpRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const data = await verifyLoginOtp(email, otp);
      completeLogin(data);
      notifySuccess('Đăng nhập thành công! Bạn sẽ được chuyển tới trang chủ...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      const errorMessage = err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      if (errorMessage.toLowerCase().includes('otp')) {
        otpRef.current?.focus();
        notifyError('Nhập sai OTP, vui lòng nhập lại.');
      } else {
        notifyError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const errorFieldSx = {
    '& .MuiOutlinedInput-root.Mui-error fieldset': {
      borderColor: 'error.main',
      borderWidth: 2,
    },
  };
  const helperTextProps = { sx: { color: 'error.main', fontSize: '14px', fontWeight: 600 } };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }} noValidate>
      <TextField
        margin="normal"
        required
        fullWidth
        id="otp"
        label="Mã OTP"
        name="otp"
        inputRef={otpRef}
        value={otp}
        onChange={onChange}
        onBlur={validate}
        error={!!fieldErr}
        helperText={fieldErr}
        helperTextProps={helperTextProps}
        autoFocus
        sx={errorFieldSx}
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
        {submitting ? 'Đang xác thực...' : 'Đăng nhập'}
      </Button>
    </Box>
  );
};

export default LoginOtpVerificationForm;
