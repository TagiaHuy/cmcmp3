import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlaylistList from '../PlayList/PlaylistList';
import usePlaylists from '../hooks/usePlaylists';
import { useAuth } from '../context/AuthContext';
import CreatePlaylistForm from '../components/Form/CreatePlaylistForm'; // Import the form

import { deletePlaylist } from '../services/playlistService';
import { toast } from 'react-toastify';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const PlaylistsPage = () => {
  const [value, setValue] = useState(0);
  const { user } = useAuth();
  const { playlists: allPlaylists, isLoading, error, refetch } = usePlaylists();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingPlaylist(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (playlist) => {
    setEditingPlaylist(playlist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlaylist(null);
  };

  const handleDelete = async (playlistId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa playlist này không?')) {
      try {
        await deletePlaylist(playlistId);
        toast.success('Playlist đã được xóa.');
        refetch(); // Refetch data after deletion
      } catch (error) {
        toast.error(error.message || 'Không thể xóa playlist.');
      }
    }
  };

  const handleSuccess = () => {
    refetch();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // The service now normalizes ownerName to artist. We match it with user's displayName.
  const myPlaylists = allPlaylists?.filter(p => p.artist === user?.displayName) || [];

  if (error) {
    return <Typography color="error">Không thể tải playlists.</Typography>;
  }

  return (
    <Box sx={{ width: '100%', color: 'text.primary' }}>
      <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
        Playlists
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="playlist tabs">
          <Tab label="Đã Thích" {...a11yProps(0)} />
          <Tab label="Của Bạn" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Typography>Tính năng xem lại các playlist đã thích hiện chưa có.</Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenCreateModal}
          >
            Tạo Playlist Mới
          </Button>
        </Box>
        {isLoading ? <p>Đang tải...</p> : <PlaylistList playlists={myPlaylists} onEdit={handleOpenEditModal} onDelete={handleDelete} />}
      </TabPanel>

      {isModalOpen && (
        <CreatePlaylistForm
          open={isModalOpen}
          handleClose={handleCloseModal}
          initialData={editingPlaylist}
          onSuccess={handleSuccess}
        />
      )}
    </Box>
  );
};

export default PlaylistsPage;
