import React from 'react';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles'; // Import useTheme

const CommentItem = ({ comment, onDelete }) => {
    const { user } = useAuth();
    const theme = useTheme(); // Initialize useTheme
    const canDelete = user && (user.id === comment.user.id);

    return (
        <div style={{ display: 'flex', marginBottom: '15px', alignItems: 'center' }}>
            <img
                src={comment.user.avatarUrl || 'default-avatar.png'}
                alt={comment.user.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
            />
            <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: 'bold', color: theme.palette.text.primary }}>{comment.user.name}</div>
                <div style={{ fontSize: '0.9em', color: theme.palette.text.secondary }}>
                    {moment(comment.createdAt).fromNow()}
                </div>
                <div style={{ marginTop: '5px', color: theme.palette.text.primary }}>{comment.content}</div>
            </div>
            {canDelete && (
                <IconButton onClick={() => onDelete(comment.id)} size="small" sx={{ color: theme.palette.text.secondary }}>
                    <DeleteIcon />
                </IconButton>
            )}
        </div>
    );
};

export default CommentItem;