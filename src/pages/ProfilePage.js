import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import {
  Box, Typography, Paper, TextField, Button, Avatar,
  CircularProgress, Alert, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Modal,
  Divider, Switch, FormGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, updateUserAvatar } from '../services/authService';
import { updateTwoFactorPreference, requestArtistVerification } from '../services/userService';
import { uploadFile } from '../services/fileUploadService';
import API_BASE_URL from '../config';
import useIsAdmin from '../hooks/useIsAdmin';

import ArtistVerificationRequestForm from '../components/Form/ArtistVerificationRequestForm';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const isAdmin = useIsAdmin();
  const [formData, setFormData] = useState({
    displayName: '',
    gender: '',
    phoneNumber: '',
  });
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Determine if the user is an artist using a robust role check
  const isArtist = useMemo(() => {
    if (!user) return false;
    const roleCandidates = [
      ...(Array.isArray(user.roles) ? user.roles : []),
      ...(Array.isArray(user.authorities) ? user.authorities : []),
      ...(Array.isArray(user.roleList) ? user.roleList : []),
    ];

    const roleStrs = roleCandidates
      .map(r => (typeof r === "string" ? r : (r?.authority || r?.name || r?.role || r?.code || "")))
      .map(s => String(s).toUpperCase());

    return roleStrs.some(s => s.includes("ARTIST"));
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        gender: user.gender || '',
        phoneNumber: user.phoneNumber || '',
      });
      setIsTwoFactorEnabled(user.twoFactorEnabled || false);
    }
  }, [user]);

  if (!user) {
    return (
      <MainLayout>
        <Box sx={{ padding: 4 }}>
          <Typography variant="h5">Vui lòng đăng nhập để xem trang này.</Typography>
        </Box>
      </MainLayout>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTwoFactorChange = async (event) => {
    const { checked } = event.target;
    const originalState = isTwoFactorEnabled;
    setIsTwoFactorEnabled(checked);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token) {
        throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.');
      }
      const updatedUser = await updateTwoFactorPreference(token);
      setUser(updatedUser);
      setSuccess(`Xác thực hai bước đã được ${updatedUser.twoFactorEnabled ? 'bật' : 'tắt'}.`);
    } catch (err) {
      setIsTwoFactorEnabled(originalState);
      setError(err.message || 'Không thể cập nhật cài đặt xác thực hai bước.');
    } finally {
      setLoading(false);
    }
  };

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
      setUser(updatedUser);
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const avatarFormData = new FormData();
    avatarFormData.append('avatar', file);

    setLoading(true);
    setError('');
    setSuccess('');
    setIsImageLoaded(false);
    try {
      if (!token) {
        setError('Không có token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      const updatedUser = await updateUserAvatar(token, avatarFormData);
      setUser(updatedUser);
      setIsImageLoaded(true);
      setSuccess('Cập nhật avatar thành công!');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải lên avatar.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (formDataFromForm) => { // Renamed for clarity
    setVerificationLoading(true);
    setVerificationError('');
    setSuccess('');

    try {
        if (!token) {
            throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.');
        }

        // Extract stageName and artistImage (File object)
        const stageName = formDataFromForm.get('stageName');
        const artistImage = formDataFromForm.get('image');

        if (!stageName || !artistImage) {
            throw new Error('Thiếu nghệ danh hoặc ảnh đại diện.');
        }

        // 1. Upload the image file
        const uploadResponse = await uploadFile(token, artistImage);
        const imageUrl = uploadResponse.url; // Assuming the response has a 'url' field

        if (!imageUrl) {
            throw new Error('Không nhận được URL ảnh sau khi tải lên.');
        }

        // 2. Submit the verification request with imageUrl
        const verificationRequestData = {
            artistName: stageName, // Use artistName as per new API spec
            imageUrl: imageUrl
        };
        await requestArtistVerification(token, verificationRequestData);

        setSuccess('Yêu cầu của bạn đã được gửi thành công và đang chờ duyệt!');
        setIsVerificationModalOpen(false);
    } catch (err) {
        setVerificationError(err.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
        setVerificationLoading(false);
    }
  };


  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ padding: 4, backgroundColor: (theme) => theme.palette.background.paper, maxWidth: 800, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Hồ sơ cá nhân
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user.avatarUrl}
              sx={{
                width: 150,
                height: 150,
                cursor: 'pointer',
                border: '2px solid',
                opacity: isImageLoaded ? 1 : 0,
                clipPath: isImageLoaded ? 'inset(0% 0% 0% 0%)' : 'inset(95% 0% 0% 0%)',
                transition: 'opacity 0.7s ease-out, clip-path 0.7s ease-out',
              }}
              onClick={handleAvatarClick}
              imgProps={{ onLoad: () => setIsImageLoaded(true) }}
            />

            <Button variant="outlined" onClick={handleAvatarClick}>Đổi Avatar</Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
              accept="image/*"
            />
          </Box>

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
                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ display: 'flex', gap: 1 }}
              >
                {loading && <CircularProgress size={20} />}
                 Lưu thay đổi
              </Button>
              {user.provider === 'LOCAL' && !isAdmin && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/change-password')}
                >
                  Đổi mật khẩu
                </Button>
              )}
              {!isAdmin && !isArtist && (
                 <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsVerificationModalOpen(true)}
                >
                    Yêu cầu xác thực nghệ sĩ
                </Button>
              )}
            </Box>

            {user.provider === 'LOCAL' && !isAdmin && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Cài đặt bảo mật
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isTwoFactorEnabled}
                        onChange={handleTwoFactorChange}
                        disabled={loading}
                      />
                    }
                    label="Xác thực hai bước (Đăng nhập với OTP)"
                  />
                </FormGroup>
              </>
            )}

          </Box>
        </Box>
      </Paper>

        <Modal
            open={isVerificationModalOpen}
            onClose={() => setIsVerificationModalOpen(false)}
            aria-labelledby="verification-modal-title"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Paper sx={{ padding: 4, width: '100%', maxWidth: 500,  bgcolor: 'background.paper' }}>
                <ArtistVerificationRequestForm
                    onSubmit={handleVerificationSubmit}
                    isLoading={verificationLoading}
                    error={verificationError}
                />
            </Paper>
        </Modal>
    </Box>
  );
};


export default ProfilePage;
