import React, { useState } from 'react';
import { Box, Typography, Stack, Divider, Button, Menu, MenuItem, ListItemIcon } from '@mui/material'; // NEW: Menu, MenuItem, ListItemIcon
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'; // Icon Lượt Nghe
import FavoriteIcon from '@mui/icons-material/Favorite'; // Icon Lượt Thích (dùng thay FavoriteBorderIcon)
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // Icon Số Bài hát
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteAlbumButton from '../Button/Specific/FavoriteAlbumButton';
import PlayallButton from '../Button/Specific/PlayallButton'; // NEW: Use PlayallButton
import MoreButton from '../Button/Specific/MoreButton'; // NEW: MoreButton
import ShareMenu from '../MenuItem/Specific/ShareMenu'; // NEW: ShareMenu

const AlbumDetailCard = ({ album, handlePlayAlbum, isPlaying, isOwner, onDelete, onEdit }) => { // REVERTED PROPS: isOwner, onDelete, onEdit
  const creatorName = album.creator?.name || "Người dùng"; // Giả định album.creator là một đối tượng có trường name

  const [anchorEl, setAnchorEl] = useState(null); // State for MoreButton menu
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box 
      sx={{ 
        p: { xs: 3, md: 6 }, 
        maxWidth: 1000, // Giới hạn chiều rộng cho desktop
        mx: 'auto', // Căn giữa
        // Thiết lập nền nhẹ nếu cần, hoặc để nền mặc định của trang
      }}
    >
      {/* --- PHẦN HEADER: Ảnh và Thông tin chính (Flex cho Desktop) --- */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Dọc trên mobile, Ngang trên desktop
          alignItems: { xs: 'center', md: 'flex-start' }, // Căn chỉnh trên desktop
          textAlign: { xs: 'center', md: 'left' }, // Căn giữa trên mobile, trái trên desktop
          mb: 4,
          gap: { xs: 3, md: 4 }, // Khoảng cách giữa ảnh và nội dung
        }}
      >
        {/* 1. Ảnh Album */}
        <Box
          component="img"
          sx={{
            width: { xs: 200, md: 300 },
            objectFit: 'cover',
            borderRadius: 3, // Bo góc mềm mại
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)', // Đổ bóng nổi bật
            flexShrink: 0, // Đảm bảo ảnh không bị co lại
          }}
          src={album.imageUrl}
          alt={album.title}
        />

        {/* 2. Nội dung Album */}
        <Stack> 
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            Album
          </Typography>

          {/* Tiêu đề (Nổi bật nhất) */}
          <Typography 
            variant="h2" // Cỡ chữ lớn cho tiêu đề
            component="h1" 
            color="text.primary" 
            fontWeight={800} // Cực kỳ đậm
          >
            {album.title}
          </Typography>

          {/* Mô tả (nếu có) */}
          {album.description && (
            <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
              {album.description}
            </Typography>
          )}

          {/* Thông tin Người tạo và Ngày tạo */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {creatorName}
            </Typography>
            {album.createdAt && ( // Chỉ hiển thị nếu có createdAt
              <Typography variant="body2" color="text.secondary">
                • {new Date(album.createdAt).toLocaleDateString()} {/* Format ngày */}
              </Typography>
            )}
          </Stack>

          {/* Thống kê (Lượt Nghe | Lượt Thích | Số Bài hát) */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 1 }}>
            
            {/* Lượt Nghe */}
            {album.listenCount && ( // Chỉ hiển thị nếu có listenCount
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <HeadsetMicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {album.listenCount}
                </Typography>
              </Stack>
            )}

            {/* Lượt Thích */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
              <Typography variant="body2" color="text.secondary">
                {album.likeCount || 0}
              </Typography>
            </Stack>
            
            {/* Số Bài hát */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <MusicNoteIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {album.numberOfSongs || 0} bài hát
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ mb: 4 }} /> {/* Đường phân cách */}

      {/* --- PHẦN ACTION BUTTONS --- */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        width: '100%', 
        justifyContent: { xs: 'center', md: 'flex-start' } // Căn trái trên desktop
      }}>
        {/* Nút Play Nổi bật */}
        <PlayallButton isPlaying={isPlaying} handlePlayPause={handlePlayAlbum} sx={{ width: 64, height: 64, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }} />
        
        {/* Các nút phụ (Kích thước tiêu chuẩn) */}
        <FavoriteAlbumButton albumId={album.id} isFavorite={album.isFavorite} />
        <MoreButton onClick={handleMenuOpen} />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'more-button',
          }}
        >
          <ShareMenu anchorEl={anchorEl} open={open} onCloseMenu={handleMenuClose} type="album" id={album.id} />

        </Menu>
      </Box>
    </Box>
  );
};

export default AlbumDetailCard;
