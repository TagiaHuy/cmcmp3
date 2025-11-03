import React, { useState } from 'react';
import { Box, TextField, Button, Divider, Typography, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import SendIcon from '@mui/icons-material/Send';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSendOtp = () => {
    if (!formData.email) {
      alert('Vui lòng nhập email trước khi xác thực.');
      return;
    }
    console.log(`Simulating sending OTP to ${formData.email}`);
    setIsOtpSent(true);
  };

  const handleGoogleLogin = () => {
    console.log("Simulating Google Login...");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log("Registration submitted with:", formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="fullName"
        label="Họ và Tên"
        name="fullName"
        autoComplete="name"
        value={formData.fullName}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="phone"
        label="Số điện thoại"
        name="phone"
        autoComplete="tel"
        value={formData.phone}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Địa chỉ Email"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="text"
                onClick={handleSendOtp}
                disabled={isOtpSent}
                startIcon={<SendIcon />}
              >
                Xác thực
              </Button>
            </InputAdornment>
          ),
        }}
      />
      {isOtpSent && (
        <TextField
          margin="normal"
          required
          fullWidth
          id="otp"
          label="Mã xác thực OTP"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
        />
      )}
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="gender-label">Giới tính</InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          name="gender"
          value={formData.gender}
          label="Giới tính"
          onChange={handleChange}
        >
          <MenuItem value={'male'}>Nam</MenuItem>
          <MenuItem value={'female'}>Nữ</MenuItem>
          <MenuItem value={'other'}>Khác</MenuItem>
        </Select>
      </FormControl>
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Mật khẩu"
        type="password"
        id="password"
        value={formData.password}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Xác nhận Mật khẩu"
        type="password"
        id="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ 
          mt: 3, 
          mb: 2,
          backgroundColor: (theme) => theme.Button.highlightButtonBackground,
          '&:hover': {
            backgroundColor: (theme) => theme.Button.highlightButtonHoverBackground
          }
        }}
      >
        Đăng Ký
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
          backgroundColor: '#4285F4', // Fallback color
          backgroundImage: 'linear-gradient(to right, #4285F4, #DB4437, #F4B400, #0F9D58)',
          backgroundSize: '200% auto',
          transition: 'background-position 0.5s ease-out',
          '&:hover': {
            backgroundPosition: 'right center', // Change the gradient direction on hover
          }
        }}
      >
        Đăng ký với Google
      </Button>
    </Box>
  );
};

export default RegisterForm;
