// src/utils/http.js
export async function safeJson(res) {
  const text = await res.text();             // đọc text trước
  if (!text) return null;                    // body rỗng -> trả null
  try { return JSON.parse(text); } catch { return null; }
}
