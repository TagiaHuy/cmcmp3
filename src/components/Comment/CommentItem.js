import React from 'react';
import moment from 'moment'; // Assuming moment.js is available or will be installed
import { useTheme } from '@mui/material/styles';

const CommentItem = ({ comment }) => {
    const theme = useTheme();
    return (
        <div style={{ display: 'flex', marginBottom: '15px' }}>
            <img
                src={comment.user.avatarUrl || 'default-avatar.png'} // Provide a default avatar
                alt={comment.user.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
            />
            <div>
                <div style={{ fontWeight: 'bold', color:theme.palette.text.primary }}>{comment.user.name}</div>
                <div style={{ fontSize: '0.9em', color: '#888' }}>
                    {moment(comment.createdAt).fromNow()}
                </div>
                <div style={{ marginTop: '5px', color:theme.palette.text.primary }}>{comment.content}</div>
            </div>
        </div>
    );
};

export default CommentItem;