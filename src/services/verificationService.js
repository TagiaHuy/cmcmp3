import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";
import { authHeader } from "../utils/auth";

export async function getPendingArtistVerifications(token, signal) {
  const res = await fetch(`${API_BASE_URL}/api/admin/artist-verification-requests`, { // Updated endpoint
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
    const res = await fetch(`${API_BASE_URL}/api/admin/artist-verification-requests/${verificationId}/approve`, { // Updated endpoint
      method: "POST",
      headers: {
        ...authHeader(token),
        Accept: "application/json",
      },
    });
  
    // Expect a string message, not necessarily JSON
    if (!res.ok) {
      const data = await res.text(); // Read as text for error message
      const msg = data || `HTTP ${res.status}`;
      throw new Error(msg);
    }
  
    return await res.text(); // Return the success message
}

export async function denyArtistVerification(token, verificationId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/artist-verification-requests/${verificationId}/reject`, { // Updated endpoint to /reject
      method: "POST",
      headers: {
        ...authHeader(token),
        Accept: "application/json",
      },
    });
  
    // Expect a string message, not necessarily JSON
    if (!res.ok) {
      const data = await res.text(); // Read as text for error message
      const msg = data || `HTTP ${res.status}`;
      throw new Error(msg);
    }
  
    return await res.text(); // Return the success message
}