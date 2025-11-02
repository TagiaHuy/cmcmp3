import React from 'react';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../../assets/cmcmp3-logo.png';

const LogoButton = () => {
  return (
    <IconButton component={Link} to="/">
      <img src={logo} alt="logo" style={{ width: 200 }} />
    </IconButton>
  );
};

export default LogoButton;