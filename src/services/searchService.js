
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

export const search = async (query, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/search?q=${query}`, {
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

    return data || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};
