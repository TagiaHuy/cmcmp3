
// src/services/artistService.js
import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

/**
 * Lấy thông tin một nghệ sĩ bằng ID (yêu cầu JWT Bearer token)
 * @param {string} artistId - ID của nghệ sĩ cần lấy
 * @param {AbortSignal} signal - Abort signal để cancel request
 */
export const getArtistById = async (artistId, signal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/artists/${artistId}`, {
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
    console.error(`Error fetching artist with ID ${artistId}:`, error);
    throw error; // Re-throw the error to be caught by the calling hook
  }
};
