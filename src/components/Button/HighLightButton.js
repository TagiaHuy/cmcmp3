import React from 'react';
import { Button } from '@mui/material';

function HighLightButton({ children, ...props }) {
  return (
    <Button 
      variant="contained" 
      {...props}
      sx={{ 
          backgroundColor: (theme) => theme.Button.highlightButtonBackground,
          color: 'white', 
          borderRadius: '20px', 
          fontWeight: 'bold',
          '&:hover': { backgroundColor: (theme) => theme.Button.highlightButtonHoverBackground }
      }}
    >
      {children}
    </Button>
  );
}

export default HighLightButton;