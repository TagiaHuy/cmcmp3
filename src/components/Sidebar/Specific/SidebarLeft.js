// src/components/Sidebar/Specific/SidebarLeft.js
import React, { useMemo } from 'react';
import Sidebar from '../Sidebar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'; // New import
import LogoButton from '../../Button/Specific/LogoButton';
import { useAuth } from '../../../context/AuthContext';

function SidebarLeft() {
  const { isAdmin } = useAuth();

  const items = useMemo(() => {
    const base = [
      { text: 'Inbox', icon: <InboxIcon />, to: '/' },
      { text: 'Starred', icon: <MailIcon />, to: '/recently-played' },
      { text: 'Thư viện', icon: <LibraryMusicIcon />, to: '/library' },
      { text: 'Nghệ sĩ', icon: <PeopleAltRoundedIcon />, to: '/artists' }, // General Artists link
      { text: 'Send email', icon: <InboxIcon />, to: '/test' },
      { text: 'Drafts', icon: <MailIcon />, to: '/test' },
    ];
    if (isAdmin) {
      base.push({ text: 'Quản lý tài khoản', icon: <PeopleAltRoundedIcon />, to: '/admin/users' });
      // Removed the "Create Artist" button for admins
    }
    return base;
  }, [isAdmin]);

  return <Sidebar anchor="left" items={items} logoComponent={<LogoButton />} />;
}

export default SidebarLeft;
