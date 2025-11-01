import React from 'react';
import Sidebar from '../Sidebar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const items = [
  { text: 'All mail', icon: <InboxIcon /> },
  { text: 'Trash', icon: <MailIcon /> },
  { text: 'Spam', icon: <InboxIcon /> },
];

function SidebarRight() {
  return <Sidebar anchor="right" items={items} />;
}

export default SidebarRight;
