// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import { updateUserProfile, updateUserAvatar } from '../services/authService';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    gender: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Ảnh đang hiển thị ở trang profile (URL server hoặc blob preview)
  const [localAvatar, setLocalAvatar] = useState(null);

  // Sync form + avatar khi user (context) thay đổi
  useEffect(() => {
    if (!user) return;

    setFormData({
      displayName: user.displayName || '',
      gender: user.gender || '',
      phoneNumber: user.phoneNumber || '',
    });

    // Chỉ set từ BE nếu chưa có preview blob
    setLocalAvatar((prev) => (prev ? prev : user.avatarUrl || null));
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">
          Vui lòng đăng nhập để xem trang này.
        </Typography>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟦 LƯU THÔNG TIN (tên, giới tính, sđt)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token) {
        setError('Không có token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      const updatedUser = await updateUserProfile(token, formData);

      // MERGE user mới vào user cũ, KHÔNG làm mất avatarUrl nếu API không trả về
      setUser((prev) => {
        if (!prev) return updatedUser;
        const merged = { ...prev, ...updatedUser };
        if (!updatedUser?.avatarUrl && prev.avatarUrl) {
          merged.avatarUrl = prev.avatarUrl;
        }
        return merged;
      });

      setSuccess('Cập nhật thông tin thành công!');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 🟥 ĐỔI AVATAR
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn đúng file ảnh.');
      return;
    }

    // 1️⃣ Preview ngay cho người dùng
    const previewUrl = URL.createObjectURL(file);
    setLocalAvatar(previewUrl);

    // 2️⃣ Upload lên BE
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token) {
        setError('Không có token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      const updatedUser = await updateUserAvatar(token, formDataUpload);

      // MERGE user mới (có avatarUrl mới) vào user cũ
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      setSuccess('Cập nhật avatar thành công!');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải lên avatar.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Chọn src: ưu tiên blob preview, nếu không thì dùng user.avatarUrl
  const avatarSrc = localAvatar || user.avatarUrl || undefined;

  console.log('ProfilePage user =', user);
  console.log('ProfilePage avatarSrc =', avatarSrc);

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper
        sx={{
          padding: 4,
          backgroundColor: (theme) => theme.palette.background.paper,
          maxWidth: 800,
          width: '100%',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Hồ sơ cá nhân
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Avatar + nút đổi ảnh */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar
              src={avatarSrc}
              sx={{
                width: 150,
                height: 150,
                cursor: 'pointer',
                border: '2px solid',
              }}
              onClick={handleAvatarClick}
            >
              {!avatarSrc &&
                (user.displayName?.[0] ||
                  user.email?.[0] ||
                  'U')}
            </Avatar>
            <Button variant="outlined" onClick={handleAvatarClick}>
              Đổi Avatar
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
              accept="image/*"
            />
          </Box>

          {/* Thông tin text */}
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              label="Tên hiển thị"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={user.email}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Giới tính</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <FormControlLabel value="male" control={<Radio />} label="Nam" />
                <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                <FormControlLabel value="other" control={<Radio />} label="Khác" />
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2, display: 'flex', gap: 1 }}
            >
              {loading && <CircularProgress size={20} />}
              Lưu thay đổi
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
