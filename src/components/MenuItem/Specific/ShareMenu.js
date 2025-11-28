// src/components/MenuItem/Specific/ShareMenu.jsx
import React from 'react';
import ShareMenuItem from './ShareMenuItem';

const ShareMenu = ({ type, id, onCloseMenu }) => {
  return (
    <>
      <ShareMenuItem
        type={type}
        id={id}
        onCloseMenu={onCloseMenu}
        shareOption="copy"
      />
      <ShareMenuItem
        type={type}
        id={id}
        onCloseMenu={onCloseMenu}
        shareOption="facebook"
      />
    </>
  );
};

export default ShareMenu;
