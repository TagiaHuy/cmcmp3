import React from 'react';
import { IconButton } from '@mui/material';

function NormalButton({ children, ...props }) {
  return (
    <IconButton
      {...props}
      sx={{ 
        backgroundColor: (theme) => theme.Button.background,
        '&:hover': {
          backgroundColor: (theme) => theme.Button.hoverBackground,
        },
      }}
    >
      {children}
    </IconButton>
  );
}

export default NormalButton;