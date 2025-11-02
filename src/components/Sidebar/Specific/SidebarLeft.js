import React from 'react';
import Sidebar from '../Sidebar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LogoButton from '../../Button/Specific/LogoButton';

const items = [
  { text: 'Inbox', icon: <InboxIcon /> },
  { text: 'Starred', icon: <MailIcon /> },
  { text: 'Send email', icon: <InboxIcon /> },
  { text: 'Drafts', icon: <MailIcon /> },
];

function SidebarLeft() {
  return <Sidebar anchor="left" items={items} logoComponent={<LogoButton />} />;
}

export default SidebarLeft;
