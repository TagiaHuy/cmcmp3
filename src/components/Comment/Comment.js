import React from 'react';
import useComments from '../../hooks/useComments';
import CommentItem from './CommentItem';
import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';

const Comment = ({ songId }) => {
    const { comments, loading, error } = useComments(songId);
    const theme = useTheme();
    if (loading) {
        return <div>Loading comments...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!comments || comments.length === 0) {
        return <div>No comments yet.</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant='h6' sx={{color:theme.palette.text.primary}}>Comments</Typography>
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default Comment;