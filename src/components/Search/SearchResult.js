import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import ResultCard from '../Card/ResultCard';
import ArtistResultCard from '../Card/ArtistResultCard';
import PlaylistResultCard from '../Card/PlaylistResultCard';

function SearchResult({ anchorEl, open, handleClose, results, handlePlay }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      
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
        results.map((result, index) => {
          switch (result.type) {
            case 'song':
              return (
                <ResultCard
                  key={index}
                  sx={{ width: 430 }}
                  id={result.id}
                  mediaSrc={result.mediaSrc}
                  imageUrl={result.imageUrl}
                  title={result.title}
                  subtitle={result.artists}
                  onPlay={handlePlay}
                />
              );
            case 'artist':
              return <ArtistResultCard key={index} artist={result} sx={{ width: 430 }} />;
            case 'playlist':
              return <PlaylistResultCard key={index} playlist={result} sx={{ width: 430 }} />;
            default:
              return null;
          }
        })
      ) : (
        <MenuItem disabled>No results found</MenuItem>
      )}
    </Menu>
  );
}

export default SearchResult;
