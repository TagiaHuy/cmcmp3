// src/pages/RecentlyPlayedPage.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import { useMediaPlayer } from '../context/MediaPlayerContext';

const RecentlyPlayedPage = () => {
  const { isAuthenticated } = useAuth();
  const { recentlyPlayed, handlePlay, normalizeArtists } = useMediaPlayer();
  const location = useLocation();

  // ❗ Chưa đăng nhập → yêu cầu đăng nhập
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Bạn cần đăng nhập để xem danh sách "Nghe gần đây"
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/login"
            state={{ from: location }} // optional: để login xong quay lại
          >
            Đăng nhập ngay
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // Đã đăng nhập → hiển thị danh sách nghe gần đây
  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Nghe gần đây
        </Typography>

        {!recentlyPlayed?.length ? (
          <Typography>Hiện chưa có bài hát nào trong "Nghe gần đây".</Typography>
        ) : (
          // render list chi tiết theo style bạn muốn
          <pre>{JSON.stringify(recentlyPlayed, null, 2)}</pre>
        )}
      </Box>
    </MainLayout>
  );
};

export default RecentlyPlayedPage;
