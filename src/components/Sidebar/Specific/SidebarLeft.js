// src/components/Sidebar/Specific/SidebarLeft.js
import React, {useContext, useMemo} from 'react';
import Sidebar from '../Sidebar';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import HistoryIcon from '@mui/icons-material/History';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import LogoButton from '../../Button/Specific/LogoButton';
import { useAuth } from '../../../context/AuthContext';
import {ThemeContext} from "../../../theme/ThemeContext";

function SidebarLeft() {
  const { isAdmin } = useAuth();
  const { currentTheme } = useContext(ThemeContext);

  const items = useMemo(() => {
    const librarySection = [
      { section: 'Library' },
      { text: 'Thư viện', icon: <LibraryMusicIcon />, to: '/library' },
      { text: 'Nghệ sĩ', icon: <PeopleAltRoundedIcon />, to: '/artists' },
      { text: 'Nghe gần đây', icon: <HistoryIcon />, to: '/recently-played' },
      { text: 'Playlist', icon: <PlaylistPlayIcon />, to: '/my-playlists' },
    ];

    const adminSection = isAdmin
      ? [
          { section: 'Admin' },
          { text: 'Quản lý tài khoản', icon: <PeopleAltRoundedIcon />, to: '/admin/users' },
        ]
      : [];

    return [...librarySection, ...adminSection];
  }, [isAdmin]);

  return (
    <Sidebar
      anchor="left"
      items={items}
      logoComponent={<LogoButton />}
      sxItem={{
        px: 2.2,
        py: 1.1,
        borderRadius: '10px',
        fontSize: '0.97rem',
        fontWeight: 500,
        color: 'text.primary',
        transition: '0.25s ease',
        '&:hover': {
          background: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(4px)',
          transform: 'translateX(4px)',
        },
      }}
      sxSection={{
        px: 2.5,
        py: 1,
        fontSize: '0.75rem',
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        mt: 2,
        mb: 0.5,
      }}
    />
  );
}

export default SidebarLeft;
