import { useState, useEffect, useCallback } from 'react';
import commentService from '../services/commentService';
import { useAuth } from '../context/AuthContext';

const useAdminPendingComments = () => {
    const { isAdmin } = useAuth();
    const [pendingComments, setPendingComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingComments = useCallback(async (signal) => {
        if (!isAdmin) {
            setLoading(false);
            setError(new Error('Chỉ quản trị viên mới có thể xem trang này.'));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const [songCommentsRes, playlistCommentsRes] = await Promise.all([
                commentService.getAdminPendingSongComments(0, 100, signal),
                commentService.getAdminPendingPlaylistComments(0, 100, signal),
            ]);

            const songComments = songCommentsRes.content.map(comment => ({
                ...comment,
                type: 'song',
            }));
            const playlistComments = playlistCommentsRes.content.map(comment => ({
                ...comment,
                type: 'playlist',
            }));

            // Combine and sort by creation date (newest first)
            const combinedComments = [...songComments, ...playlistComments].sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            setPendingComments(combinedComments);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        const controller = new AbortController();
        fetchPendingComments(controller.signal);
        return () => controller.abort();
    }, [fetchPendingComments]);

    const approveComment = async (commentType, contentId, commentId) => {
        try {
            if (commentType === 'song') {
                await commentService.approveSongComment(contentId, commentId);
            } else if (commentType === 'playlist') {
                await commentService.approvePlaylistComment(contentId, commentId);
            }
            fetchPendingComments(); // Refresh the list
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const rejectComment = async (commentType, contentId, commentId) => {
        try {
            if (commentType === 'song') {
                await commentService.rejectSongComment(contentId, commentId);
            } else if (commentType === 'playlist') {
                await commentService.rejectPlaylistComment(contentId, commentId);
            }
            fetchPendingComments(); // Refresh the list
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return { pendingComments, loading, error, approveComment, rejectComment, fetchPendingComments };
};

export default useAdminPendingComments;
