import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Keep useAuth if isAdmin is used elsewhere, otherwise remove
import CreateArtistForm from '../components/Form/CreateArtistForm';
import { getAllArtists } from '../services/artistService'; // Assuming this service function exists
import ArtistList from '../components/ArtistList/ArtistList'; // Import ArtistList

const ArtistsPage = () => {
  const { isAdmin } = useAuth(); // Keep this if you want to use isAdmin for other things on the page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtists = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllArtists(signal); 
      setArtists(data || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Không thể tải danh sách nghệ sĩ. API có thể chưa tồn tại.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchArtists(ac.signal);
    return () => ac.abort();
  }, [fetchArtists]);

  const handleArtistCreated = (newArtist) => {
    // Add the new artist to the list without a full refetch
    setArtists(prev => [newArtist, ...prev]);
    setIsModalOpen(false); // Close modal after creation
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>{error}</Typography>;
    }

    if (artists.length === 0) {
      return <Typography sx={{ textAlign: 'center', py: 5 }}>Chưa có nghệ sĩ nào.</Typography>;
    }

    return (
      <ArtistList artists={artists} />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary.main">
          Nghệ sĩ
        </Typography>
        {isAdmin && ( // Wrap button with isAdmin check
          <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
            Tạo nghệ sĩ mới
          </Button>
        )}
      </Box>

      {renderContent()}

      <CreateArtistForm 
        open={isModalOpen} 
        handleClose={() => setIsModalOpen(false)}
        onArtistCreated={handleArtistCreated}
      />
    </Box>
  );
};

export default ArtistsPage;