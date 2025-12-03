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
    Paper,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FlagIcon from '@mui/icons-material/Flag';
import { useTheme } from '@mui/material/styles';
import reportService from '../../services/reportService';
import { useNotifications } from '../../hooks/useNotifications';
import CreateReportModal from '../Modal/CreateReportModal';

const CommentItem = ({ comment, onDelete, onUpdate, onApprove, onReject, isPending = false, parentType }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const { notifySuccess, notifyError } = useNotifications();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const canModify = user && (user.id === comment.user.id);
    const canReport = user && !canModify;

    const handleUpdate = () => {
        if (editedContent.trim()) {
            onUpdate(comment.id, editedContent);
            setIsEditing(false);
        }
    };

    const handleReportSubmit = async (reason) => {
        try {
            const entityType = parentType === 'song' ? 'SONG_COMMENT' : 'PLAYLIST_COMMENT';
            await reportService.createReport({
                entityType: entityType,
                entityId: comment.id,
                reason: reason,
            });
            notifySuccess('Báo cáo của bạn đã được gửi thành công. Cảm ơn bạn đã đóng góp!');
            setIsReportModalOpen(false);
        } catch (err) {
            notifyError(err.message || 'Không thể gửi báo cáo. Vui lòng thử lại.');
        }
    };

    return (
        <>
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
                    <Stack direction="row" spacing={0.5}>
                        {isPending ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                {canModify && (
                                    <>
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
                                    </>
                                )}
                                {canReport && (
                                    <Tooltip title="Báo cáo vi phạm">
                                        <IconButton
                                            onClick={() => setIsReportModalOpen(true)}
                                            size="small"
                                        >
                                            <FlagIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </>
                        )}
                    </Stack>
                </Stack>
            </Paper>
            <CreateReportModal
                open={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleReportSubmit}
            />
        </>
    );
};

export default CommentItem;
