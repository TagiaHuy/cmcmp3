import API_BASE_URL from '../config';
import { safeJson } from '../utils/http';
import { authHeader } from '../utils/auth';

export const getAllTags = async (signal) => {
  const res = await fetch(`${API_BASE_URL}/api/tags`, {
    method: "GET",
    headers: {
      ...authHeader(),
      Accept: "application/json",
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};
