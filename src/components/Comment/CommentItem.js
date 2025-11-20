import React, { useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import {
    Avatar,
    Box,
    Stack,
    Typography,
    TextField,
    Button,
    IconButton,
    Tooltip,
    Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';

const CommentItem = ({ comment, onDelete, onUpdate }) => {
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
        <Paper elevation={1} sx={{bgcolor: theme.palette.primary.comment, p: 2, mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* Avatar */}
                <Avatar
                    src={comment.user.avatarUrl || 'default-avatar.png'}
                    alt={comment.user.name}
                    sx={{ width: 40, height: 40 }}
                />

                {/* Comment Content */}
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.primary">
                        {comment.user.name}
                    </Typography>
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
                                    Save
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
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
                {canModify && (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                            <IconButton
                                onClick={() => setIsEditing(true)}
                                size="small"
                                color="primary"
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
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
