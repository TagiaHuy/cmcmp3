import { useState, useEffect, useCallback } from 'react';
import { getPendingArtistVerifications } from '../services/verificationService';
import { useAuth } from '../context/AuthContext';

const useArtistVerifications = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        if (!token) {
            setError("Authentication required.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await getPendingArtistVerifications(token);
            setRequests(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch verification requests.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return { requests, loading, error, refresh: fetchRequests };
};

export default useArtistVerifications;
