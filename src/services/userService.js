import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";
import { authHeader } from "../utils/auth";

export async function getAllUsers(signal) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "GET",
    headers: {
      ...authHeader(),               // ⬅ BẮT BUỘC PHẢI CÓ DÒNG NÀY
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
