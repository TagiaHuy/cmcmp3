import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { ThemeContext } from '../../../ThemeContext';

const ThemeToggleButton = () => {
  const { toggleTheme, currentTheme } = useContext(ThemeContext);

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        backgroundColor: (theme) => theme.Button.background,
        color: (theme) => theme.Button.iconColor,
        '&:hover': {
          backgroundColor: (theme) => theme.Button.hoverBackground,
        },
      }}
    >
      {currentTheme === 'dark' ? <WbSunnyOutlinedIcon /> : <NightlightOutlinedIcon />}
    </IconButton>
  );
};

export default ThemeToggleButton;