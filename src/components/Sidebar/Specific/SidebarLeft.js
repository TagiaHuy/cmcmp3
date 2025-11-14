// src/components/Sidebar/Specific/SidebarLeft.js
import React, { useMemo } from 'react';
import Sidebar from '../Sidebar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import LogoButton from '../../Button/Specific/LogoButton';
import { useAuth } from '../../../context/AuthContext';

function SidebarLeft() {
  const { isAdmin } = useAuth();

  const items = useMemo(() => {
    const navSection = [
      { section: 'Navigation' },
      { text: 'Inbox', icon: <InboxIcon />, to: '/' },
      { text: 'Starred', icon: <MailIcon />, to: '/recently-played' },
    ];

    const librarySection = [
      { section: 'Library' },
      { text: 'Thư viện', icon: <LibraryMusicIcon />, to: '/library' },
      { text: 'Nghệ sĩ', icon: <PeopleAltRoundedIcon />, to: '/artists' },
    ];

    const otherSection = [
      { section: 'Others' },
      { text: 'Send email', icon: <InboxIcon />, to: '/test' },
      { text: 'Drafts', icon: <MailIcon />, to: '/test' },
    ];

    const adminSection = isAdmin
      ? [
          { section: 'Admin' },
          { text: 'Quản lý tài khoản', icon: <PeopleAltRoundedIcon />, to: '/admin/users' },
        ]
      : [];

    return [...navSection, ...librarySection, ...otherSection, ...adminSection];
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
        color: 'rgba(255,255,255,0.86)',
        transition: '0.25s ease',
        '&:hover': {
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(4px)',
          transform: 'translateX(4px)',
        },
      }}
      sxSection={{
        px: 2.5,
        py: 1,
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        mt: 2,
        mb: 0.5,
      }}
    />
  );
}

export default SidebarLeft;
