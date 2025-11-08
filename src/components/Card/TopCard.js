import React from 'react';
import { Box, Typography } from '@mui/material';
import BaseCard from './BaseCard';
import CardTag from './CardTag';
import PlayableImage from './PlayableImage';

function TopCard({ playlist, onPlay, variant = 'default' }) {

  const { title, artists, imageUrl, mediaSrc } = playlist;



  // Style cho container card

  const cardStyle = {
    width: 320, 
    height: 130,
    borderRadius: '4px',
    padding: 2,
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    backgroundColor: variant === 'simple' ? (theme) => theme.palette.action.hover : 'transparent',

    '&:hover': {
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
      background: variant === 'simple' ? (theme) => theme.palette.action.selected : 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%)',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
      zIndex: 1,
      display: variant === 'simple' ? 'none' : 'block',
    },

  };



  return (
    <BaseCard sx={cardStyle}>
        {variant === 'default' && (
          <>
            {/* Blurred background image */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(8px)',
                    zIndex: 0,
                }}

            />

            {/* Lớp thông báo "CÓ THỂ BẠN THÍCH" */}
            <CardTag text="CÓ THỂ BẠN THÍCH" />

          </>

        )}
        
        {/* Khung chứa hình ảnh */}
        <PlayableImage imageUrl={imageUrl} title={title} sx={{ position: 'absolute', top: 15, left: 15, zIndex: 2 }} onPlay={onPlay} playlist={playlist} mediaSrc={mediaSrc} />
        {/* Nội dung chữ */}
        <Box sx={{ marginLeft: '160px', zIndex: 3, paddingBottom: 3, position: 'relative' }}>
            <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                color={variant === 'simple' ? 'text.primary' : 'white'}
                sx={{ lineHeight: 1.2 }}

            >
                {title}
            </Typography>
            <Typography 
                variant="caption" 
                color={variant === 'simple' ? 'text.secondary' : '#ccc'} 
                mt={0.5}
                sx={{ display: 'block' }}

            >
                {artists}
            </Typography>
        </Box>
    </BaseCard>
  );

}
export default TopCard;