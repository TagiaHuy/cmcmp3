import React, { useState } from 'react';
import NormalButton from '../NormalButton';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import SettingMenu from '../../MenuItem/Specific/SettingMenu';

function SettingButton() {
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);

  const handleSettingsMenu = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  return (
    <div>
      <NormalButton
        aria-label="settings"
        aria-controls="settings-menu"
        aria-haspopup="true"
        onClick={handleSettingsMenu}
        color="inherit"
      >
        <SettingsIcon />
      </NormalButton>
      <SettingMenu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        handleClose={handleSettingsClose}
      />
    </div>
  );
}

export default SettingButton;