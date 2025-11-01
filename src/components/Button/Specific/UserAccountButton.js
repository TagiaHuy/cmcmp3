import React, { useState } from 'react';
import NormalButton from '../NormalButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import UserAccountMenu from '../../MenuItem/Specific/UserAccountMenu';

function UserAccountButton() {
  const [userAccountAnchorEl, setUserAccountAnchorEl] = useState(null);

  const handleUserAccountMenu = (event) => {
    setUserAccountAnchorEl(event.currentTarget);
  };

  const handleUserAccountClose = () => {
    setUserAccountAnchorEl(null);
  };

  return (
    <div>
      <NormalButton
        aria-label="account of current user"
        aria-controls="user-account-menu"
        aria-haspopup="true"
        onClick={handleUserAccountMenu}
        color="inherit"
      >
        <AccountCircle />
      </NormalButton>
      <UserAccountMenu
        anchorEl={userAccountAnchorEl}
        open={Boolean(userAccountAnchorEl)}
        handleClose={handleUserAccountClose}
      />
    </div>
  );
}

export default UserAccountButton;