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
    getPendingCommentsBySongId: async (songId, page = 0, size = 10, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/comments/pending?page=${page}&size=${size}`, {
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
            console.error('Error fetching pending comments:', error);
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
                body: JSON.stringify({ content, status: 'PENDING' }),
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
    },
    deleteComment: async (songId, commentId, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    ...authHeader(),
                    Accept: "application/json",
                },
                signal,
            });

            if (!res.ok) {
                const data = await safeJson(res);
                const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
                throw new Error(msg);
            }

            // DELETE requests might not have a body, so we don't try to parse it
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },
    updateComment: async (songId, commentId, content, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/comments/${commentId}`, {
                method: "PUT",
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
            console.error('Error updating comment:', error);
            throw error;
        }
    },
    getCommentsByPlaylistId: async (playlistId, page = 0, size = 10, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/comments?page=${page}&size=${size}`, {
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
            console.error('Error fetching playlist comments:', error);
            throw error;
        }
    },
    getPendingCommentsByPlaylistId: async (playlistId, page = 0, size = 10, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/comments/pending?page=${page}&size=${size}`, {
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
            console.error('Error fetching pending playlist comments:', error);
            throw error;
        }
    },
    postPlaylistComment: async (playlistId, content, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/comments`, {
                method: "POST",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ content, status: 'PENDING' }),
                signal,
            });

            const data = await safeJson(res);

            if (!res.ok) {
                const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
                throw new Error(msg);
            }

            return data;
        } catch (error) {
            console.error('Error posting playlist comment:', error);
            throw error;
        }
    },
    updatePlaylistComment: async (playlistId, commentId, content, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/comments/${commentId}`, {
                method: "PUT",
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
            console.error('Error updating playlist comment:', error);
            throw error;
        }
    },
    deletePlaylistComment: async (playlistId, commentId, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    ...authHeader(),
                    Accept: "application/json",
                },
                signal,
            });

            if (!res.ok) {
                const data = await safeJson(res);
                const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
                throw new Error(msg);
            }
        } catch (error) {
            console.error('Error deleting playlist comment:', error);
            throw error;
        }
    },

    approveSongComment: async (songId, commentId, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/comments/${commentId}/approve`, {
                method: "POST",
                headers: { ...authHeader() },
                signal,
            });
            if (!res.ok) {
                const data = await safeJson(res);
                const msg = (data?.message || data?.error) || `HTTP ${res.status}`;
                throw new Error(msg);
            }
        } catch (error) {
            console.error('Error approving song comment:', error);
            throw error;
        }
    },
    rejectSongComment: async (songId, commentId, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs/${songId}/comments/${commentId}/reject`, {
                method: "POST",
                headers: { ...authHeader() },
                signal,
            });
            if (!res.ok) {
                const data = await safeJson(res);
                const msg = (data?.message || data?.error) || `HTTP ${res.status}`;
                throw new Error(msg);
            }
        } catch (error) {
            console.error('Error rejecting song comment:', error);
            throw error;
        }
    },

    approvePlaylistComment: async (playlistId, commentId, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/comments/${commentId}/approve`, {
                method: "POST",
                headers: { ...authHeader() },
                signal,
            });
            if (!res.ok) {
                const data = await safeJson(res);
                const msg = (data?.message || data?.error) || `HTTP ${res.status}`;
                throw new Error(msg);
            }
        } catch (error) {
            console.error('Error approving playlist comment:', error);
            throw error;
        }
    },
    rejectPlaylistComment: async (playlistId, commentId, signal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/comments/${commentId}/reject`, {
                method: "POST",
                headers: { ...authHeader() },
                signal,
            });
            if (!res.ok) {
                const data = await safeJson(res);
                const msg = (data?.message || data?.error) || `HTTP ${res.status}`;
                throw new Error(msg);
            }
        } catch (error) {
            console.error('Error rejecting playlist comment:', error);
            throw error;
        }
    }
};

export default commentService;