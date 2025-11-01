import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Search() {
  return (
    <TextField
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
      
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: (theme) => theme.search.icon }} />
          </InputAdornment>
        ),
        placeholder: "Tìm kiếm bài hát, nghệ sĩ, lời bài hát...",
        disableUnderline: true,
      }}
    />
  );
}

export default Search;