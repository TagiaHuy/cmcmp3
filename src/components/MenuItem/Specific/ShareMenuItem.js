import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook'; // Import Facebook icon
import { useNotifications } from '../../../hooks/useNotifications';
import { copyToClipboard } from '../../../utils/clipboard';
import shareService from '../../../services/shareService'; // Import shareService

const ShareMenuItem = ({ type, id, onCloseMenu, shareOption = 'copy' }) => { // Added shareOption prop
  const { notifySuccess, notifyError } = useNotifications();

  const handleShare = async () => {
    onCloseMenu(); // Close the menu when an item is clicked

    let publicShareUrl;
    try {
      if (type === 'song') {
        publicShareUrl = await shareService.getSongShareUrl(id);
      } else if (type === 'playlist') {
        publicShareUrl = await shareService.getPlaylistShareUrl(id);
      } else {
        notifyError('Loại không hợp lệ để chia sẻ.');
        return;
      }

      if (!publicShareUrl) {
        notifyError('Không thể lấy URL chia sẻ.');
        return;
      }
    } catch (error) {
      console.error('Error fetching share URL:', error);
      notifyError('Lỗi khi lấy URL chia sẻ.');
      return;
    }

    if (shareOption === 'copy') {
      const success = await copyToClipboard(publicShareUrl);
      if (success) {
        notifySuccess('Link đã được sao chép vào clipboard!');
      } else {
        notifyError('Không thể sao chép link.');
      }
    } else if (shareOption === 'facebook') {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicShareUrl)}`;
      window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
      notifySuccess('Đã mở cửa sổ chia sẻ Facebook!');
    }
  };

  return (
    <MenuItem onClick={handleShare}>
      <ListItemIcon>
        {shareOption === 'copy' && <ShareIcon fontSize="small" />}
        {shareOption === 'facebook' && <FacebookIcon fontSize="small" />}
      </ListItemIcon>
      <ListItemText>
        {shareOption === 'copy' && 'Sao chép liên kết'}
        {shareOption === 'facebook' && 'Chia sẻ lên Facebook'}
      </ListItemText>
    </MenuItem>
  );
};

export default ShareMenuItem;