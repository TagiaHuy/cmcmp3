import React from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: (theme) => theme.navigation.backgroundColor }}>
      <IconButton
        sx={{ color: (theme) => theme.navigation.iconColor }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackOutlinedIcon />
      </IconButton>
      <IconButton
        sx={{ color: (theme) => theme.navigation.iconColor }}
        onClick={() => navigate(1)}
      >
        <ArrowForwardOutlinedIcon />
      </IconButton>
    </Box>
  );
}

export default Navigation;