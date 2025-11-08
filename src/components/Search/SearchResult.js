import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import InternalLinkMenuItem from '../MenuItem/InternalLinkMenuItem';
import RecommendCard from '../Card/RecommendCard';
function SearchResult({ anchorEl, open, handleClose, results, handlePlay }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      
      // ✅ TẮT HOÀN TOÀN CHẾ ĐỘ FOCUS CỦA MENU
      disableAutoFocusItem={true}
      disableAutoFocus={true}
      disableEnforceFocus={true}
      disableRestoreFocus={true}

      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.Button.background,
          borderRadius: '12px',
          width: 450,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      {results && results.length > 0 ? (
        results.map((result, index) => (
          // <MenuItem key={index} onClick={handleClose}>
          //   {result.title}
          // </MenuItem>
          <RecommendCard sx={{width: 430}} mediaSrc={result.mediaSrc} imageUrl={result.imageUrl} title={result.title} subtitle={result.artists} onPlay={handlePlay} />
        ))
      ) : (
        <MenuItem disabled>No results found</MenuItem>
      )}
    </Menu>
  );
}

export default SearchResult;
