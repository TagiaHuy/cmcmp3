import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";
import { authHeader } from "../utils/auth";

export async function getPendingArtistVerifications(token, signal) {
  const res = await fetch(`${API_BASE_URL}/api/admin/artist-verifications`, {
    method: "GET",
    headers: {
      ...authHeader(token),
      Accept: "application/json",
    },
    signal,
  });

  if (!res.ok) {
    const data = await safeJson(res);
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return await safeJson(res);
}

export async function approveArtistVerification(token, verificationId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/artist-verifications/${verificationId}/approve`, {
      method: "POST",
      headers: {
        ...authHeader(token),
        Accept: "application/json",
      },
    });
  
    if (!res.ok) {
      const data = await safeJson(res);
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
  
    return {};
}

export async function denyArtistVerification(token, verificationId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/artist-verifications/${verificationId}/deny`, {
      method: "POST",
      headers: {
        ...authHeader(token),
        Accept: "application/json",
      },
    });
  
    if (!res.ok) {
      const data = await safeJson(res);
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
  
    return {};
}
