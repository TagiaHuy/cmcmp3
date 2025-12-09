// src/services/statsService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

export const getSummary = async (signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stats/summary`, {
      method: "GET",
      headers: {
        ...authHeader(),
        Accept: "application/json",
      },
      signal,
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error(`Error fetching summary stats:`, error);
    throw error;
  }
};
