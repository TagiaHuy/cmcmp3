import React from 'react';
import { Box, Toolbar, GlobalStyles } from '@mui/material';
import Header from './Header';
import SidebarLeft from '../components/Sidebar/Specific/SidebarLeft';
import SidebarRight from '../components/Sidebar/Specific/SidebarRight';
import Footer from './Footer';
import MediaPlayer from '../components/MediaPlayer/MediaPlayer';
import { MediaPlayerProvider, useMediaPlayer } from '../context/MediaPlayerContext';

const scrollbarStyles = (
  <GlobalStyles
    styles={{
      '*::-webkit-scrollbar': {
        width: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '*::-webkit-scrollbar-thumb': {
        background: '#555',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        background: '#888',
      },
      // For Firefox
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: '#555 transparent',
      },
    }}
  />
);

function MainLayout({ children }) {
  return (
    <MediaPlayerProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </MediaPlayerProvider>
  );
}

function MainLayoutContent({ children }) {
  const { currentPlayingSrc, mediaPlayerKey, isSidebarRightVisible } = useMediaPlayer();
  const drawerWidth = 280; // Define drawerWidth here

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {scrollbarStyles}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: `${drawerWidth}px 1fr ${isSidebarRightVisible ? drawerWidth : 0}px`, 
        flexGrow: 1, 
        overflow: 'hidden',
        transition: 'grid-template-columns 0.3s ease-in-out',
      }}>
        <SidebarLeft />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.body.background,
            paddingBottom: currentPlayingSrc ? '100px' : '24px',
            overflowY: 'auto',
          }}
        >
          <Header />
          <Toolbar />
          {children}
        </Box>
        {isSidebarRightVisible && <SidebarRight />}
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