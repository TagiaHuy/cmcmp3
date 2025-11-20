// src/utils/auth.js

/**
 * Lấy token từ localStorage và trim "Bearer "
 * @returns {string|null} Raw token string
 */
export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token.replace(/^Bearer\s+/i, "").trim();
}

export function authHeader() {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
