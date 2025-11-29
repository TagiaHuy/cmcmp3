import React from 'react';
import {
    Box, Typography, CircularProgress, Alert, Paper, Stack, Button, Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useAdminPendingComments from '../hooks/useAdminPendingComments';
// import MainLayout from '../layout/MainLayout'; // Removed MainLayout import
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

const AdminCommentModerationPage = () => {
    const { pendingComments, loading, error, approveComment, rejectComment } = useAdminPendingComments();
    const navigate = useNavigate();

    const handleApprove = async (commentType, contentId, commentId) => {
        try {
            await approveComment(commentType, contentId, commentId);
        } catch (err) {
            console.error('Lỗi khi phê duyệt bình luận:', err);
            // Optionally show a notification
        }
    };

    const handleReject = async (commentType, contentId, commentId) => {
        try {
            await rejectComment(commentType, contentId, commentId);
        } catch (err) {
            console.error('Lỗi khi từ chối bình luận:', err);
            // Optionally show a notification
        }
    };

    const navigateToContent = (commentType, contentId) => {
        if (commentType === 'song') {
            navigate(`/songs/${contentId}`);
        } else if (commentType === 'playlist') {
            navigate(`/playlist/${contentId}`);
        }
    };

    if (loading) {
        return (
            // <MainLayout> // Removed MainLayout usage
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            // </MainLayout>
        );
    }

    if (error) {
        return (
            // <MainLayout> // Removed MainLayout usage
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">{error.message || 'Không thể tải bình luận đang chờ.'}</Alert>
                </Box>
            // </MainLayout>
        );
    }

    return (
        // <MainLayout> // Removed MainLayout usage
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom color="white">Quản lý Bình luận Đang chờ</Typography>

                {pendingComments.length === 0 && (
                    <Typography>Không có bình luận nào đang chờ phê duyệt.</Typography>
                )}

                <Stack spacing={3}>
                    {pendingComments.map((comment) => {
                        const contentId = comment.type === 'song' 
                            ? (comment.song?.id || comment.songId) 
                            : (comment.playlist?.id || comment.playlistId);
                        const contentTitle = comment.type === 'song' 
                            ? (comment.song?.title || comment.songTitle) 
                            : (comment.playlist?.title || comment.playlistTitle);

                        console.log('Comment Type:', comment.type);
                        console.log('Content ID:', contentId);
                        console.log('Content Title:', contentTitle);
                        console.log('Full Comment Object:', comment);

                        return (
                            <Paper key={comment.id} elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="subtitle1" fontWeight="bold">{comment.user.name}</Typography>
                                    <Chip
                                        label={comment.type === 'song' ? 'Bài hát' : 'Playlist'}
                                        icon={comment.type === 'song' ? <MusicNoteIcon /> : <PlaylistPlayIcon />}
                                        size="small"
                                        color="primary"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {moment(comment.createdAt).fromNow()}
                                    </Typography>
                                </Stack>
                                <Typography variant="body1">"{comment.content}"</Typography>

                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nội dung:
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color="primary"
                                        onClick={() => {
                                            console.log('Clicked! comment.type:', comment.type, 'contentId:', contentId);
                                            navigateToContent(comment.type, contentId);
                                        }}
                                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        {contentTitle}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleApprove(comment.type, contentId, comment.id)}
                                    >
                                        Phê duyệt
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleReject(comment.type, contentId, comment.id)}
                                    >
                                        Từ chối
                                    </Button>
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>
            </Box>
        // </MainLayout>
    );
};

export default AdminCommentModerationPage;
