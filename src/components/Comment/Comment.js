import React, { useState } from 'react';
import useComments from '../../hooks/useComments';
import CommentItem from './CommentItem';
import { useTheme } from '@emotion/react';
import { Typography, TextField, Button } from '@mui/material';

const Comment = ({ songId }) => {
    const { comments, loading, error, postComment } = useComments(songId);
    const [newComment, setNewComment] = useState('');
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            await postComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant='h6' sx={{color:theme.palette.text.primary}}>Comments</Typography>
            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ marginRight: '10px' }}
                />
                <Button type="submit" variant="contained">Post</Button>
            </form>

            {loading && <div>Loading comments...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && (!comments || comments.length === 0) && <div>No comments yet.</div>}

            {comments && comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default Comment;