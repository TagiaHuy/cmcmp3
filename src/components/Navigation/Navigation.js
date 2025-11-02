import React from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

function Navigation() {
  return (
    <Box sx={{ backgroundColor: (theme) => theme.navigation.backgroundColor }}>
      <IconButton sx={{ color: (theme) => theme.navigation.iconColor }}>
        <ArrowBackOutlinedIcon />
      </IconButton>
      <IconButton sx={{ color: (theme) => theme.navigation.iconColor }}>
        <ArrowForwardOutlinedIcon />
      </IconButton>
    </Box>
  );
}

export default Navigation;