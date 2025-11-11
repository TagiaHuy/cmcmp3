// src/utils/auth.js
export function authHeader() {
  let token = localStorage.getItem("token");
  if (!token) return {};

  // BE đôi khi trả kèm "Bearer " hoặc có xuống dòng
  token = token.replace(/^Bearer\s+/i, "").trim();
  return { Authorization: `Bearer ${token}` };
}
