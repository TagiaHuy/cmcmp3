import { useState, useEffect, useCallback } from 'react';
import commentService from '../services/commentService';
import { getSongById } from '../services/songService'; // Import songService
import { getPlaylistById } from '../services/playlistService'; // Import playlistService
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

            // Extract unique song and playlist IDs
            const uniqueSongIds = [...new Set(songCommentsRes.content.map(c => c.song?.id).filter(Boolean))];
            const uniquePlaylistIds = [...new Set(playlistCommentsRes.content.map(c => c.playlist?.id).filter(Boolean))];

            // Fetch song and playlist details for titles
            const [songsData, playlistsData] = await Promise.all([
                Promise.all(uniqueSongIds.map(id => getSongById(id, signal))),
                Promise.all(uniquePlaylistIds.map(id => getPlaylistById(id, signal))),
            ]);

            const songsMap = new Map(songsData.filter(Boolean).map(s => [s.id, s]));
            const playlistsMap = new Map(playlistsData.filter(Boolean).map(p => [p.id, p]));

            const songComments = songCommentsRes.content.map(comment => ({
                ...comment,
                type: 'song',
                song: comment.song?.id ? (songsMap.get(comment.song.id) || comment.song) : comment.song, // Replace with full song object
            }));
            const playlistComments = playlistCommentsRes.content.map(comment => ({
                ...comment,
                type: 'playlist',
                playlist: comment.playlist?.id ? (playlistsMap.get(comment.playlist.id) || comment.playlist) : comment.playlist, // Replace with full playlist object
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
