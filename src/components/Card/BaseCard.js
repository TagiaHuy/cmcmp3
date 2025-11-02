import React from 'react';
import { Card, CardContent } from '@mui/material';

const BaseCard = ({ children, sx, ...props }) => {
  return (
    <Card
      sx={{
        minWidth: 250,
        minHeight: 100,
        borderRadius: '8px',
        backgroundColor: (theme) => theme.body.background,
        color: (theme) => theme.palette.text.primary,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        ...sx,
      }}
      {...props}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default BaseCard;