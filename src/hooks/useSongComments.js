import { useState, useEffect, useCallback } from 'react';
import commentService from '../services/commentService';

const useSongComments = (songId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(0);

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

    useEffect(() => {
        if (!songId) return;
        const controller = new AbortController();
        setPage(0);
        fetchComments(0, 10, controller.signal);
        return () => {
            controller.abort();
        };
    }, [songId, fetchComments]);

    const postComment = async (content) => {
        try {
            await commentService.postComment(songId, content);
            setPage(0);
            const controller = new AbortController();
            await fetchComments(0, 10, controller.signal);
        } catch (err) {
            setError(err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await commentService.deleteComment(songId, commentId);
            setPage(0);
            const controller = new AbortController();
            await fetchComments(0, 10, controller.signal);
        } catch (err) {
            setError(err);
        }
    };

    const updateComment = async (commentId, content) => {
        try {
            await commentService.updateComment(songId, commentId, content);
            setPage(0);
            const controller = new AbortController();
            await fetchComments(0, 10, controller.signal);
        } catch (err) {
            setError(err);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage);
    }


    return { comments, loading, error, pagination, postComment, deleteComment, updateComment, fetchComments, loadMore };
};

export default useSongComments;