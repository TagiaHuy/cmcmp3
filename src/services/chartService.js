import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";

export async function getRealtimeChart(signal) {
  const res = await fetch(`${API_BASE_URL}/api/charts/realtime`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

export async function getWeeklyTiles(signal) {
  const res = await fetch(`${API_BASE_URL}/api/charts/weekly`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}
