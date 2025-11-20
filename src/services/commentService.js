import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

const commentService = {
    getCommentsBySongId: async (songId, page = 0, size = 10, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/comments?page=${page}&size=${size}`, {
                method: "GET",
                headers: {
                    ...authHeader(),
                    Accept: "application/json",
                },
                signal,
            });

            const data = await safeJson(res);

            if (!res.ok) {
                const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
                throw new Error(msg);
            }

            return data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },
    postComment: async (songId, content, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/comments`, {
                method: "POST",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ content }),
                signal,
            });

            const data = await safeJson(res);

            if (!res.ok) {
                const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
                throw new Error(msg);
            }

            return data;
        } catch (error) {
            console.error('Error posting comment:', error);
            throw error;
        }
    }
};

export default commentService;