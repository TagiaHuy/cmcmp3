import React from 'react';
import { Menu, MenuItem } from '@mui/material';

function SearchResult({ anchorEl, open, handleClose, results }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      disableAutoFocusItem
      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.Button.background,
          borderRadius: '12px',
          width: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      {results && results.length > 0 ? (
        results.map((result, index) => (
          <MenuItem key={index} onClick={handleClose}>
            {result.title}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No results found</MenuItem>
      )}
    </Menu>
  );
}

export default SearchResult;