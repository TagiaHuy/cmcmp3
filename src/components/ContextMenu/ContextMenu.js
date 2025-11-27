import React from 'react';
import { Paper, MenuItem, MenuList } from '@mui/material';

const ContextMenu = ({ menuPosition, options, onClose }) => {
  if (!menuPosition) {
    return null;
  }

  const handleMenuItemClick = (onClick) => {
    onClose();
    onClick();
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: menuPosition.y,
        left: menuPosition.x,
        zIndex: 1000,
      }}
    >
      <MenuList>
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(option.onClick)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};

export default ContextMenu;
