import React, { useState } from 'react';
import { Box, GlobalStyles } from '@mui/material';
import Header from './Header';
import SidebarLeft from '../components/Sidebar/Specific/SidebarLeft';
import SidebarRight from '../components/Sidebar/Specific/SidebarRight';
import MediaPlayer from '../components/MediaPlayer/MediaPlayer';
import { MediaPlayerProvider, useMediaPlayer } from '../context/MediaPlayerContext';
import 'react-toastify/dist/ReactToastify.css';
import Chatbot from '../components/Chatbot/Chatbot'; // Import Chatbot component

const scrollbarStyles = (
  <GlobalStyles
    styles={{
      '*::-webkit-scrollbar': { width: '8px' },
      '*::-webkit-scrollbar-track': { background: 'transparent' },
      '*::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '4px' },
      '*::-webkit-scrollbar-thumb:hover': { background: '#888' },
      '*': { scrollbarWidth: 'thin', scrollbarColor: '#555 transparent' }, // Firefox
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
  const { currentPlayingSrc, isSidebarRightVisible } = useMediaPlayer();
  const drawerWidth = 280;
  const [showChatbot, setShowChatbot] = useState(false); // State to manage chatbot visibility

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {scrollbarStyles}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `${drawerWidth}px 1fr ${isSidebarRightVisible ? drawerWidth : 0}px`,
          flexGrow: 1,
          overflow: 'hidden',
          transition: 'grid-template-columns 0.3s ease-in-out',
          '--player-h': currentPlayingSrc ? '100px' : '0px',
        }}
      >
        <SidebarLeft />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.body.background,
            paddingBottom: currentPlayingSrc ? '100px' : '24px',
            overflowY: 'scroll',
            overflowX: 'hidden',
            scrollbarGutter: 'stable both-edges',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 64px - 100px)', // Adjust based on header and player height
          }}
        >
          <Header />

          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
        </Box>

        {isSidebarRightVisible && <SidebarRight />}
      </Box>

      {currentPlayingSrc && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            bgcolor: (theme) => theme.body.background,
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 0,
          }}
        >
          <MediaPlayer />
        </Box>
      )}

      {showChatbot && <Chatbot onClose={toggleChatbot} />}
      <button className="floating-chat-button" onClick={toggleChatbot}>
        {showChatbot ? '—' : '💬'}
      </button>
    </Box>
  );
}

export default MainLayout;

