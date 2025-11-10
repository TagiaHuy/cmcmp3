import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import InternalLinkMenuItem from '../InternalLinkMenuItem';
import ExternalLinkMenuItem from '../ExternalLinkMenuItem';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BrushIcon from '@mui/icons-material/Brush';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import PhoneIcon from '@mui/icons-material/Phone';
import RecommendCard from '../../Card/RecommendCard';

function SearchMenu({ anchorEl, open, handleClose }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.Button.background,
          borderRadius: '12px',
          width: 250,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <RecommendCard />
      <InternalLinkMenuItem
        icon={<PlayArrowIcon sx={{ color: (theme) => theme.Button.textColor }} />}
        text="Trình phát nhạc"
        onClick={handleClose}
      />
      <InternalLinkMenuItem
        icon={<BrushIcon sx={{ color: (theme) => theme.Button.textColor }} />}
        text="Giao diện"
        onClick={handleClose}
      />
      <MenuItem
        onClick={handleClose}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
      </MenuItem>
      <ExternalLinkMenuItem
        icon={<AdUnitsIcon sx={{ color: (theme) => theme.Button.textColor }} />}
        text="Quảng cáo"
        onClick={handleClose}
      />
      <ExternalLinkMenuItem
        icon={<PhoneIcon sx={{ color: (theme) => theme.Button.textColor }} />}
        text="Liên hệ"
        onClick={handleClose}
      />
    </Menu>
  );
}

export default SearchMenu;