// src/components/MenuItem/Specific/DownloadMenuItem.jsx
import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useNotifications } from '../../../hooks/useNotifications';
import { downloadSong } from '../../../services/songService';
import { useAuth } from '../../../context/AuthContext';

const DownloadMenuItem = ({ songId, songTitle, onCloseMenu }) => {
  const { notifySuccess, notifyError } = useNotifications();

  // an toàn: nếu useAuth() trả null thì auth = null
  const auth = useAuth();
  const user  = auth?.user;
  const token = auth?.token;
  const isAuthenticated = !!token || !!user;

  // Nếu chưa có bài hát thì khỏi vẽ menu
  if (!songId) return null;

  const handleDownload = async (e) => {
    e.stopPropagation();
    onCloseMenu?.();

    if (!songTitle) {
      notifyError('Không thể tải bài hát. Thiếu thông tin bài hát.');
      return;
    }

    // Nếu chưa đăng nhập
    if (!isAuthenticated) {
      notifyError('Vui lòng đăng nhập để tải bài hát.');
      return;
    }

    notifySuccess('Đang chuẩn bị tải xuống bài hát...');
    try {
      await downloadSong(songId, songTitle);
      notifySuccess('Bài hát đã được tải xuống thành công!');
    } catch (error) {
      console.error(error);
      notifyError(error?.message || 'Tải xuống bài hát thất bại.');
    }
  };

  return (
    <MenuItem onClick={handleDownload}>
      <ListItemIcon>
        <DownloadOutlinedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Tải xuống" />
    </MenuItem>
  );
};

export default DownloadMenuItem;
