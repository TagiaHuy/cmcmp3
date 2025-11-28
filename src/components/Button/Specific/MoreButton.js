import React from 'react';
import NormalButton from '../NormalButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function MoreButton({ visible = true, onClick, ...props }) {
  if (!visible) {
    return null;
  }

  return (
    <NormalButton {...props} onClick={onClick}>
      <MoreHorizIcon />
    </NormalButton>
  );
}

export default MoreButton;
