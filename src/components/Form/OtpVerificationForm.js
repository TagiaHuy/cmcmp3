import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';

const OtpVerificationForm = ({ displayName, email, password }) => {
  const { register } = useAuth();
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
    if (otp.length < 6) {
      setFieldErr('Mã OTP phải có 6 chữ số');
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
      await register(displayName, email, password, otp);
      notifySuccess('Đăng ký thành công! Bạn sẽ được chuyển tới trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errorMessage = err?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      if (errorMessage.toLowerCase().includes('otp')) {
        // setFieldErr('Mã OTP không hợp lệ hoặc đã hết hạn.'); // Removed field error
        otpRef.current?.focus();
        notifyError('Mã OTP không hợp lệ hoặc đã hết hạn.'); // Retained toast.error
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
        {submitting ? 'Đang xác thực...' : 'Hoàn tất Đăng ký'}
      </Button>
    </Box>
  );
};

export default OtpVerificationForm;
