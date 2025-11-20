import { useState, useEffect, useCallback } from 'react';
import commentService from '../services/commentService';

const useComments = (songId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    const fetchComments = useCallback(async (signal) => {
        try {
            setLoading(true);
            const data = await commentService.getCommentsBySongId(songId, 0, 10, signal);
            setComments(data.content);
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
        fetchComments(controller.signal);
        return () => {
            controller.abort();
        };
    }, [songId, fetchComments]);

    const postComment = async (content) => {
        try {
            await commentService.postComment(songId, content);
            // Refetch comments after posting
            const controller = new AbortController();
            await fetchComments(controller.signal);
        } catch (err) {
            setError(err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await commentService.deleteComment(songId, commentId);
            // Refetch comments after deleting
            const controller = new AbortController();
            await fetchComments(controller.signal);
        } catch (err) {
            setError(err);
        }
    };

    const updateComment = async (commentId, content) => {
        try {
            await commentService.updateComment(songId, commentId, content);
            // Refetch comments after updating
            const controller = new AbortController();
            await fetchComments(controller.signal);
        } catch (err) {
            setError(err);
        }
    };


    return { comments, loading, error, pagination, postComment, deleteComment, updateComment };
};

export default useComments;