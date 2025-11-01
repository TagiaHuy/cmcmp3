import React from 'react';
import { Menu, Divider } from '@mui/material';
import InternalLinkMenuItem from '../InternalLinkMenuItem';
import ExternalLinkMenuItem from '../ExternalLinkMenuItem';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import LockIcon from '@mui/icons-material/Lock';
import FlagIcon from '@mui/icons-material/Flag';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import PhoneIcon from '@mui/icons-material/Phone';
import UpgradeButton from '../../Button/Specific/UpgradeButton';

function SettingMenu({ anchorEl, open, handleClose }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.settingMenu.background,
          borderRadius: '12px',
          width: 250,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <InternalLinkMenuItem
        icon={<PlayArrowIcon sx={{ color: (theme) => theme.settingMenu.textColor }} />}
        text="Trình phát nhạc"
        onClick={handleClose}
      />
      <InternalLinkMenuItem
        icon={<BrushIcon sx={{ color: (theme) => theme.settingMenu.textColor }} />}
        text="Giao diện"
        onClick={handleClose}
      />
      <ExternalLinkMenuItem
        icon={<AdUnitsIcon sx={{ color: (theme) => theme.settingMenu.textColor }} />}
        text="Quảng cáo"
        onClick={handleClose}
      />
      <ExternalLinkMenuItem
        icon={<PhoneIcon sx={{ color: (theme) => theme.settingMenu.textColor }} />}
        text="Liên hệ"
        onClick={handleClose}
      />
    </Menu>
  );
}

export default SettingMenu;