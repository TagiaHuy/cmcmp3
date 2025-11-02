import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function InternalLinkMenuItem({ icon, text, onClick }) {
  return (
    <MenuItem 
      onClick={onClick} 
      sx={{ 
        color: (theme) => theme.Button.textColor, 
        '&:hover': { backgroundColor: (theme) => theme.Button.hoverBackground } 
      }}
    >
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
      <ChevronRightIcon fontSize="small" sx={{ color: (theme) => theme.Button.textColor }} />
    </MenuItem>
  );
}

export default InternalLinkMenuItem;