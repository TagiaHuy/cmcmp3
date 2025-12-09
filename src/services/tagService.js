import { authHeader } from '../utils/auth';
import { safeJson } from '../utils/http';
import API_BASE_URL from '../config';

export const getAllTags = async (signal) => {
    const res = await fetch(`${API_BASE_URL}/api/tags`, {
        method: 'GET',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json',
        },
        signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
};

export const getTagById = async (tagId, signal) => {
    const res = await fetch(`${API_BASE_URL}/api/tags/${tagId}`, {
        method: 'GET',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json',
        },
        signal,
    });

    const data = await safeJson(res);

    if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
};