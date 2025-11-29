import { useState, useEffect, useCallback } from 'react';
import commentService from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import useSong from './useSong';

const useSongComments = (songId) => {
    const { user, isAdmin } = useAuth();
    const { song } = useSong(songId);

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

    const canModerate = isAdmin || (user && song && song.uploader && user.id === song.uploader.id);

    const fetchComments = useCallback(async (page = 0, size = 10, signal) => {
        try {
            setLoading(true);
            const data = await commentService.getCommentsBySongId(songId, page, size, signal);
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
    }, [songId]);

    const fetchPendingComments = useCallback(async (page = 0, size = 10, signal) => {
        if (!canModerate) {
            setPendingLoading(false);
            return;
        };
        try {
            setPendingLoading(true);
            const data = await commentService.getPendingCommentsBySongId(songId, page, size, signal);
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
    }, [songId, canModerate]);

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
        if (!songId) return;
        const controller = new AbortController();
        refreshAll();
        return () => {
            controller.abort();
        };
    }, [songId, fetchComments, fetchPendingComments]);

    const postComment = async (content) => {
        try {
            await commentService.postComment(songId, content);
            // After posting, don't refetch, just inform the user.
            // The UI component will handle showing the "pending" message.
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await commentService.deleteComment(songId, commentId);
            refreshAll();
        } catch (err) {
            setError(err);
        }
    };

    const updateComment = async (commentId, content) => {
        try {
            await commentService.updateComment(songId, commentId, content);
            refreshAll();
        } catch (err) {
            setError(err);
        }
    };

    const approveComment = async (commentId) => {
        try {
            await commentService.approveSongComment(songId, commentId);
            refreshAll();
        } catch (err) {
            setPendingError(err);
        }
    }

    const rejectComment = async (commentId) => {
        try {
            await commentService.rejectSongComment(songId, commentId);
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

export default useSongComments;