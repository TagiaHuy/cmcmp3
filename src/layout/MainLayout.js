import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import SidebarLeft from '../components/Sidebar/Specific/SidebarLeft';
import SidebarRight from '../components/Sidebar/Specific/SidebarRight';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexGrow: 1}}>
        <SidebarLeft />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: (theme) => theme.body.background,
          }}
        >
          <Header />
          <Toolbar />
          {children}
        </Box>
        <SidebarRight />
      </Box>
      <Footer />
    </Box>
  );
}

export default MainLayout;