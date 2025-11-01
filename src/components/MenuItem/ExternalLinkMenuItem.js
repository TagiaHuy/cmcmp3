import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function ExternalLinkMenuItem({ icon, text, onClick }) {
  return (
    <MenuItem 
      onClick={onClick} 
      sx={{ 
        color: (theme) => theme.settingMenu.textColor, 
        '&:hover': { backgroundColor: (theme) => theme.settingMenu.hoverBackground } 
      }}
    >
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
      <OpenInNewIcon fontSize="small" sx={{ color: (theme) => theme.settingMenu.textColor }} />
    </MenuItem>
  );
}

export default ExternalLinkMenuItem;