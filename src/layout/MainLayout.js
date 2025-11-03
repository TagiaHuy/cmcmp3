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
  const drawerWidth = 280; // Define drawerWidth here

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `${drawerWidth}px 1fr ${drawerWidth}px`, flexGrow: 1 }}>
        <SidebarLeft />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.body.background,
            paddingBottom: currentPlayingSrc ? '100px' : '24px',
            overflow: 'auto', // Add scroll to main content area
          }}
        >
          <Header />
          <Toolbar />
          {children}
        </Box>
        <SidebarRight />
      </Box>
      
      <Footer />
      
      {currentPlayingSrc && (
        <Box sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 0,
        }}>
          <MediaPlayer key={mediaPlayerKey} src={currentPlayingSrc} />
        </Box>
      )}
    </Box>
  );
}

export default MainLayout;