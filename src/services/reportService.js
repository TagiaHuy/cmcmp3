import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

const BASE_URL = `${API_BASE_URL}/api/admin/reports`; // Updated BASE_URL

const reportService = {
    getPendingReports: async (signal) => {
        try {
            const res = await fetch(`${BASE_URL}/pending`, {
                method: "GET",
                headers: { ...authHeader(), Accept: "application/json" },
                signal,
            });
            const data = await safeJson(res);
            if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            console.error('Error fetching pending reports:', error);
            throw error;
        }
    },

    getReportById: async (reportId, signal) => {
        try {
            const res = await fetch(`${BASE_URL}/${reportId}`, {
                method: "GET",
                headers: { ...authHeader(), Accept: "application/json" },
                signal,
            });
            const data = await safeJson(res);
            if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
            return data;
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            console.error('Error fetching report by ID:', error);
            throw error;
        }
    },

    approveReport: async (reportId, signal) => {
        try {
            const res = await fetch(`${BASE_URL}/${reportId}/approve`, {
                method: "POST",
                headers: { ...authHeader(), 'Content-Type': 'application/json' }, // Added Content-Type
                signal,
            });
            if (!res.ok) {
                const data = await safeJson(res);
                throw new Error(data?.message || `HTTP ${res.status}`);
            }
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            console.error('Error approving report:', error);
            throw error;
        }
    },

    rejectReport: async (reportId, signal) => {
        try {
            const res = await fetch(`${BASE_URL}/${reportId}/reject`, {
                method: "POST",
                headers: { ...authHeader(), 'Content-Type': 'application/json' }, // Added Content-Type
                signal,
            });
            if (!res.ok) {
                const data = await safeJson(res);
                throw new Error(data?.message || `HTTP ${res.status}`);
            }
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            console.error('Error rejecting report:', error);
            throw error;
        }
    },

    createReport: async ({ entityType, entityId, reason }, signal) => {
        try {
            // Use the public-facing endpoint for creating reports
            const res = await fetch(`${API_BASE_URL}/api/reports`, {
                method: "POST",
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ entityType, entityId, reason }),
                signal,
            });
            if (!res.ok) {
                const data = await safeJson(res);
                throw new Error(data?.message || `HTTP ${res.status}`);
            }
            return await safeJson(res);
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            console.error('Error creating report:', error);
            throw error;
        }
    }
};

export default reportService;
