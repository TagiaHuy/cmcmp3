import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';

const TagListItem = ({ tag }) => {
  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 2, 
        textAlign: 'center',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
    >
      <Link to={`/tags/${tag.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box
          component="img"
          src={tag.imageUrl || 'https://via.placeholder.com/150'}
          alt={tag.name}
          sx={{
            width: '100%',
            height: 140,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 1
          }}
        />
        <Typography variant="h6" fontWeight={600}>{tag.name}</Typography>
      </Link>
    </Paper>
  );
};

export default TagListItem;
