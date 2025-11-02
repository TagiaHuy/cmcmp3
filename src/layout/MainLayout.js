import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import SidebarLeft from '../components/Sidebar/Specific/SidebarLeft';
import SidebarRight from '../components/Sidebar/Specific/SidebarRight';
import Footer from './Footer';
import MediaPlayer from '../components/MediaPlayer/MediaPlayer';
import { MediaPlayerProvider, useMediaPlayer } from '../context/MediaPlayerContext';

function MainLayout({ children }) {
  return (
    <MediaPlayerProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </MediaPlayerProvider>
  );
}

function MainLayoutContent({ children }) {
  const { currentPlayingSrc, mediaPlayerKey } = useMediaPlayer();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Vùng Nội dung Chính (trừ MediaPlayer) */}
      <Box sx={{ display: 'flex', flexGrow: 1}}>
        <SidebarLeft />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: (theme) => theme.body.background,
            // Đảm bảo padding-bottom đủ chỗ cho MediaPlayer cố định
            paddingBottom: currentPlayingSrc ? '100px' : '24px', 
          }}
        >
          <Header />
          <Toolbar />
          {children}
        </Box>
        <SidebarRight />
      </Box>
      
      {/* 2. Footer (đặt trước MediaPlayer nếu muốn nó nằm trên MediaPlayer) */}
      <Footer />
      
      {/* 3. MediaPlayer Cố Định (Fixed MediaPlayer) */}
      {currentPlayingSrc && (
        <Box sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          // Sử dụng zIndex cao để chèn lên trên tất cả (Header, Sidebar, Main, Footer)
          zIndex: (theme) => theme.zIndex.drawer + 2, // Thường 1000-1500 là đủ
          bgcolor: 'background.paper', // Hoặc màu nền của trình phát nhạc
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 0, // Điều chỉnh padding nếu cần
        }}>
          <MediaPlayer key={mediaPlayerKey} src={currentPlayingSrc} />
        </Box>
      )}
    </Box>
  );
}

export default MainLayout;