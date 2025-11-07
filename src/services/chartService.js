// src/services/chartService.js
import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";

// helper nhỏ (tùy chọn) để thêm timeout
function withTimeout(ms, signal) {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), ms);
  const controller = signal
    ? new AbortController()
    : ac;
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
    setTimeout(() => {}, 0); // no-op
  }
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

export async function getRealtimeChart(signal) {
  // tắt cache để luôn lấy điểm mới
  const { signal: s, cancel } = withTimeout(15000, signal); // 15s timeout (tùy)
  try {
    const res = await fetch(`${API_BASE_URL}/api/charts/realtime`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: s,
    });

    // (tùy chọn) Nếu BE bật ETag và trả 304 Not Modified
    if (res.status === 304) return null;

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } finally {
    cancel();
  }
}

export async function getWeeklyTiles(signal) {
  const res = await fetch(`${API_BASE_URL}/api/charts/weekly`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}
