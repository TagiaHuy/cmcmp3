import React, { useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import {
    Avatar,
    Box,
    Stack,
    Typography,
    TextField,
    Button, // Keep Button for moderation
    IconButton,
    Tooltip,
    Paper,
    Chip // Import Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';

const CommentItem = ({ comment, onDelete, onUpdate, onApprove, onReject, isPending = false }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const canModify = user && (user.id === comment.user.id);

    const handleUpdate = () => {
        if (editedContent.trim()) {
            onUpdate(comment.id, editedContent);
            setIsEditing(false);
        }
    };

    return (
        <Paper
            elevation={isPending ? 3 : 1} // Higher elevation for pending to stand out
            sx={{
                bgcolor: isPending ? theme.palette.background.paper : theme.palette.primary.comment, // More subtle color
                p: 2,
                mb: 2,
                border: isPending ? `1px solid ${theme.palette.divider}` : 'none' // Subtle border
            }}
        >
            <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* Avatar */}
                <Avatar
                    src={comment.user.avatarUrl || 'default-avatar.png'}
                    alt={comment.user.name}
                    sx={{ width: 40, height: 40 }}
                />

                {/* Comment Content */}
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2" color="text.primary">
                            {comment.user.name}
                        </Typography>
                        {isPending && (
                            <Chip
                                label="ĐANG CHỜ"
                                size="small"
                                color="warning" // Keep warning color for the chip itself
                                sx={{ height: 20, '& .MuiChip-label': { px: 1 } }}
                            />
                        )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        {moment(comment.createdAt).fromNow()}
                    </Typography>

                    {isEditing ? (
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleUpdate}
                                >
                                    Lưu
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Hủy
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 1 }}
                        >
                            {comment.content}
                        </Typography>
                    )}
                </Box>

                {/* Action Buttons */}
                {isPending ? (
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => onApprove(comment.id)}
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                        >
                            Phê duyệt
                        </Button>
                        <Button
                            onClick={() => onReject(comment.id)}
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                        >
                            Từ chối
                        </Button>
                    </Stack>
                ) : canModify && (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Chỉnh sửa">
                            <IconButton
                                onClick={() => setIsEditing(true)}
                                size="small"
                                color="primary"
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton
                                onClick={() => onDelete(comment.id)}
                                size="small"
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
};

export default CommentItem;
