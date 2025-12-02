import { useState, useEffect, useCallback } from 'react';
import reportService from '../services/reportService';
import { useAuth } from '../context/AuthContext';

const useAdminReports = () => {
    const { isAdmin } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = useCallback(async (signal) => {
        if (!isAdmin) {
            setLoading(false);
            setError(new Error('Only administrators can view this page.'));
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const pendingReports = await reportService.getPendingReports(signal);
            setReports(pendingReports);
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
        fetchReports(controller.signal);
        return () => controller.abort();
    }, [fetchReports]);

    const approveReport = async (reportId) => {
        try {
            await reportService.approveReport(reportId);
            // Re-fetch to get the updated list
            const controller = new AbortController();
            fetchReports(controller.signal);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const rejectReport = async (reportId) => {
        try {
            await reportService.rejectReport(reportId);
            // Re-fetch to get the updated list
            const controller = new AbortController();
            fetchReports(controller.signal);
        } catch (err) {
            setError(err);
throw err;
        }
    };

    return { reports, loading, error, approveReport, rejectReport, fetchReports };
};

export default useAdminReports;
