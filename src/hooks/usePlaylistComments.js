import { useState, useEffect, useCallback } from 'react';
import commentService from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import usePlaylist from './usePlaylist';

const usePlaylistComments = (playlistId) => {
    const { user, isAdmin } = useAuth();
    const { playlist } = usePlaylist(playlistId);

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(0);

    const [pendingComments, setPendingComments] = useState([]);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [pendingError, setPendingError] = useState(null);
    const [pendingPagination, setPendingPagination] = useState(null);
    const [pendingPage, setPendingPage] = useState(0);

    const canModerate = isAdmin || (user && playlist && playlist.creator && user.id === playlist.creator.id);

    const fetchComments = useCallback(async (page = 0, size = 10, signal) => {
        try {
            setLoading(true);
            const data = await commentService.getCommentsByPlaylistId(playlistId, page, size, signal);
            setComments(prevComments => page === 0 ? data.content : [...prevComments, ...data.content]);
            setPagination({
                pageNumber: data.pageable.pageNumber,
                pageSize: data.pageable.pageSize,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                last: data.last,
                first: data.first,
                numberOfElements: data.numberOfElements,
                empty: data.empty,
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    }, [playlistId]);

    const fetchPendingComments = useCallback(async (page = 0, size = 10, signal) => {
        if (!canModerate) {
            setPendingLoading(false);
            return;
        }
        try {
            setPendingLoading(true);
            const data = await commentService.getPendingCommentsByPlaylistId(playlistId, page, size, signal);
            setPendingComments(prevComments => page === 0 ? data.content : [...prevComments, ...data.content]);
            setPendingPagination({
                pageNumber: data.pageable.pageNumber,
                pageSize: data.pageable.pageSize,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                last: data.last,
                first: data.first,
                numberOfElements: data.numberOfElements,
                empty: data.empty,
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                setPendingError(err);
            }
        } finally {
            setPendingLoading(false);
        }
    }, [playlistId, canModerate]);

    const refreshAll = () => {
        const controller = new AbortController();
        setPage(0);
        fetchComments(0, 10, controller.signal);
        if (canModerate) {
            setPendingPage(0);
            fetchPendingComments(0, 10, controller.signal);
        }
    }

    useEffect(() => {
        if (!playlistId) return;
        const controller = new AbortController();
        refreshAll();
        return () => {
            controller.abort();
        };
    }, [playlistId, fetchComments, fetchPendingComments]);

    const postComment = async (content) => {
        try {
            await commentService.postPlaylistComment(playlistId, content);
            // After posting, don't refetch, just inform the user.
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await commentService.deletePlaylistComment(playlistId, commentId);
            refreshAll();
        } catch (err) {
            setError(err);
        }
    };

    const updateComment = async (commentId, content) => {
        try {
            await commentService.updatePlaylistComment(playlistId, commentId, content);
            refreshAll();
        } catch (err) {
            setError(err);
        }
    };

    const approveComment = async (commentId) => {
        try {
            await commentService.approvePlaylistComment(playlistId, commentId);
            refreshAll();
        } catch (err) {
            setPendingError(err);
        }
    }

    const rejectComment = async (commentId) => {
        try {
            await commentService.rejectPlaylistComment(playlistId, commentId);
            refreshAll();
        } catch (err) {
            setPendingError(err);
        }
    }

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage);
    }

    const loadMorePending = () => {
        const nextPage = pendingPage + 1;
        setPendingPage(nextPage);
        fetchPendingComments(nextPage);
    }

    return {
        comments, loading, error, pagination, postComment, deleteComment, updateComment, fetchComments, loadMore,
        pendingComments, pendingLoading, pendingError, pendingPagination, loadMorePending,
        approveComment, rejectComment, canModerate
    };
};

export default usePlaylistComments;