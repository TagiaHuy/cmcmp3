import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useNotifications } from '../../../hooks/useNotifications';
import { downloadSong } from '../../../services/songService';

const DownloadMenuItem = ({ songId, songTitle, onCloseMenu }) => {
  const { notifySuccess, notifyError } = useNotifications();

  const handleDownload = async () => {
    if (onCloseMenu) {
      onCloseMenu();
    }
    if (!songId || !songTitle) {
      notifyError('Không thể tải bài hát. Thiếu thông tin bài hát.');
      return;
    }
    notifySuccess('Đang chuẩn bị tải xuống bài hát...');
    try {
      await downloadSong(songId, songTitle);
      notifySuccess('Bài hát đã được tải xuống thành công!');
    } catch (error) {
      notifyError(error.message || 'Tải xuống bài hát thất bại.');
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
