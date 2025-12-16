import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

import CreateTagForm from '../components/Form/CreateTagForm';
import TagList from '../components/TagList/TagList';

import { getAllTags } from '../services/tagService';

const TagsPage = () => {
  const { user, isAdmin: isAdminFromCtx } = useAuth();

  const isAdmin = useMemo(() => {
    if (typeof isAdminFromCtx === 'boolean') return isAdminFromCtx;
    const roles = user?.roles || user?.authorities || [];
    return Array.isArray(roles) && roles.some((r) => String(r).toUpperCase().includes('ADMIN'));
  }, [isAdminFromCtx, user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllTags(signal);
      // Controller trả Page<TagDTO> => lấy content
      setTags(data?.content || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Không thể tải danh sách thể loại.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchTags(ac.signal);
    return () => ac.abort();
  }, [fetchTags]);

  const handleTagCreated = (newTag) => {
    setTags((prev) => [newTag, ...prev]);
    setIsModalOpen(false);
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
      return (
        <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>
          {error}
        </Typography>
      );
    }

    if (!tags || tags.length === 0) {
      return (
        <Typography sx={{ textAlign: 'center', py: 5 }}>
          Chưa có thể loại nào.
        </Typography>
      );
    }

    return <TagList tags={tags} />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="text.primary" sx={{ fontWeight: 700 }}>
          Thể loại
        </Typography>

        {isAdmin && (
          <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
            Tạo thể loại mới
          </Button>
        )}
      </Box>

      {renderContent()}

      <CreateTagForm
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        onTagCreated={handleTagCreated}
      />
    </Box>
  );
};

export default TagsPage;
