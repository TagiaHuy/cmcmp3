import React, { useState } from 'react';
import useSongComments from '../../hooks/useSongComments';
import usePlaylistComments from '../../hooks/usePlaylistComments';
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
    Divider,
    Card, // Import Card
    CardContent, // Import CardContent
    CardHeader // Import CardHeader
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Comment = ({ songId, playlistId }) => {
    const useComments = songId ? useSongComments : usePlaylistComments;
    const id = songId || playlistId;
    const parentType = songId ? 'song' : 'playlist';

    const {
        comments, loading, error, pagination, postComment, deleteComment, updateComment, loadMore,
        pendingComments, pendingLoading, pendingError, pendingPagination, loadMorePending,
        approveComment, rejectComment, canModerate
    } = useComments(id);

    const [newComment, setNewComment] = useState('');
    const [postStatus, setPostStatus] = useState('idle'); // 'idle' | 'success' | 'error'
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                await postComment(newComment);
                setNewComment('');
                setPostStatus('success');
            } catch (err) {
                setPostStatus('error');
            }
        }
    };

    const renderPendingComments = () => {
        if (!canModerate || (pendingComments.length === 0 && !pendingLoading && !pendingError)) return null;

        return (
            <Card variant="outlined" sx={{ mt: 4, borderColor: theme.palette.background.paper, boxShadow: 'none' }}>
                <CardHeader
                    title={
                        <Typography variant="h6" color={theme.palette.text.primary}>
                            Bình luận đang chờ phê duyệt
                        </Typography>
                    }
                    sx={{ pb: 0 }}
                />
                <CardContent>
                    {pendingLoading && pendingComments.length === 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}

                    {pendingError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {pendingError.message || 'Không thể tải bình luận đang chờ'}
                        </Alert>
                    )}

                    {!pendingLoading && !pendingError && pendingComments.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            Không có bình luận nào đang chờ.
                        </Typography>
                    )}

                    <Stack spacing={2} sx={{ mt: 2, maxHeight: 400, overflowY: 'auto', minHeight: pendingLoading ? 0 : 100 }}>
                        {pendingComments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onApprove={approveComment}
                                onReject={rejectComment}
                                isPending={true}
                                parentType={parentType}
                            />
                        ))}
                    </Stack>

                    {pendingPagination && !pendingPagination.last && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button
                                onClick={loadMorePending}
                                startIcon={<ArrowDownwardIcon />}
                                disabled={pendingLoading}
                            >
                                {pendingLoading ? 'Đang tải...' : 'Tải thêm bình luận đang chờ'}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3, mt: 2, bgcolor: theme.palette.primary.commentbg }}>
            {/* Header */}
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2 }}>
                Bình luận
            </Typography>

            {/* Add Comment Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Thêm bình luận"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onFocus={() => setPostStatus('idle')}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!newComment.trim()}
                    >
                        Đăng
                    </Button>
                </Stack>
                {postStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Bình luận của bạn đã được gửi và đang chờ kiểm duyệt.
                    </Alert>
                )}
                {postStatus === 'error' && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Không thể đăng bình luận của bạn. Vui lòng thử lại.
                    </Alert>
                )}
            </Box>

            {/* Loading State */}
            {loading && comments.length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message || 'Không thể tải bình luận'}
                </Alert>
            )}

            {/* Empty State */}
            {!loading && !error && comments.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </Typography>
            )}

            {/* Comments List */}
            <Stack spacing={2} sx={{ mt: 2, maxHeight: 600, overflowY: 'auto', minHeight: loading ? 0 : 100 }}>
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onDelete={deleteComment}
                        onUpdate={updateComment}
                        parentType={parentType}
                    />
                ))}
            </Stack>

            {/* Load More Button */}
            {pagination && !pagination.last && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        onClick={loadMore}
                        startIcon={<ArrowDownwardIcon />}
                        disabled={loading}
                    >
                        {loading ? 'Đang tải...' : 'Tải thêm'}
                    </Button>
                </Box>
            )}

            {/* Conditional Divider */}
            {canModerate && ((comments.length > 0 || !loading && !error) && (pendingComments.length > 0 || pendingLoading || pendingError)) && <Divider sx={{ my: 4 }} />}

            {renderPendingComments()}
        </Paper>
    );
};

export default Comment;
