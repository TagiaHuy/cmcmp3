import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from '../components/Header/Header';
import SidebarLeft from '../components/SidebarLeft/SidebarLeft';
import Footer from '../components/Footer/Footer';

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <SidebarLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default MainLayout;
