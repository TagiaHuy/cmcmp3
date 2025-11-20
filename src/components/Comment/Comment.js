import React, { useState } from 'react';
import useComments from '../../hooks/useComments';
import CommentItem from './CommentItem';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Stack,
    Paper,
    Pagination
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Comment = ({ songId }) => {
    const { comments, loading, error, pagination, postComment, deleteComment, updateComment, fetchComments } = useComments(songId);
    const [newComment, setNewComment] = useState('');
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            await postComment(newComment);
            setNewComment('');
        }
    };

    const handlePageChange = (event, value) => {
        fetchComments(value - 1);
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mt: 2, bgcolor: theme.palette.primary.commentbg }}>
            {/* Header */}
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2 }}>
                Comments
            </Typography>

            {/* Add Comment Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Add a comment"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!newComment.trim()}
                    >
                        Post
                    </Button>
                </Stack>
            </Box>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message || 'Failed to load comments'}
                </Alert>
            )}

            {/* Empty State */}
            {!loading && !error && comments.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    No comments yet. Be the first to comment!
                </Typography>
            )}

            {/* Comments List */}
            <Stack spacing={2} sx={{ mt: 2 }}>
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onDelete={deleteComment}
                        onUpdate={updateComment}
                    />
                ))}
            </Stack>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.pageNumber + 1}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Paper>
    );
};

export default Comment;
