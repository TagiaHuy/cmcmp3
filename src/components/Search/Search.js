import React, { useState, useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchResult from './SearchResult';
import useSearch from '../../hooks/useSearch';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
function Search() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  // Hook search
  const { results: searchResults } = useSearch(searchTerm);

  // Debounce input
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm.trim()) {
        setAnchorEl(inputRef.current);
      } else {
        setAnchorEl(null);
      }
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }, 200);

    return () => clearTimeout(debounce);
  }, [searchTerm]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {handlePlay} =  useMediaPlayer();

  return (
    <div>
      <TextField
        inputRef={inputRef}
        type="search"
        variant="outlined"
        size="small"
        sx={{
          width: 500,
          '& .MuiOutlinedInput-root': {
            borderRadius: '25px',
            backgroundColor: (theme) => theme.search.background,
            '& fieldset': {
              borderColor: (theme) => theme.search.border,
            },
            '&:hover fieldset': {
              borderColor: (theme) => theme.search.hoverBorder,
            },
            '&.Mui-focused fieldset': {
              borderColor: (theme) => theme.search.focusedBorder,
              borderWidth: '1px',
            },
          },
          '& .MuiInputBase-input': {
            color: (theme) => theme.search.text,
            paddingLeft: '8px',
            '&::placeholder': {
              color: (theme) => theme.search.placeholder,
              opacity: 1,
            },
          },
        }}
        onChange={handleSearch}
        placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: (theme) => theme.search.icon }} />
            </InputAdornment>
          ),
        }}
      />

      <SearchResult
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        handleClose={handleClose}
        results={searchResults} 
        handlePlay={handlePlay} // dùng trực tiếp từ hook
      />
    </div>
  );
}

export default Search;
