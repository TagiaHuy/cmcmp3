import React, { useState, useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchResult from './SearchResult';

function Search() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null); // Tham chiếu đến TextField

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) {
      setResults([
        { title: `Result for "${searchTerm}" 1` },
        { title: `Result for "${searchTerm}" 2` },
      ]);
      setAnchorEl(inputRef.current);
    } else {
      setResults([]);
      setAnchorEl(null);
    }

    // Trì hoãn focus để tránh xung đột với Popover
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        results={results}
      />
    </div>
  );
}

export default Search;