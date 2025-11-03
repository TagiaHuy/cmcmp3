import React from 'react';
import NormalButton from '../NormalButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function MoreButton({ visible = true, ...props }) {
  const handleClick = (e) => {
    e.stopPropagation();
  }

  if (!visible) {
    return null;
  }

  return (
    <NormalButton {...props} onClick={handleClick}>
      <MoreHorizIcon />
    </NormalButton>
  );
}

export default MoreButton;
