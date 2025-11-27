// src/hooks/useZingChart.js
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { getRealtimeChart } from "../services/chartService";

// Banner tuần (FE)
import vnCover from "../assets/vn.png";
import usukCover from "../assets/usuk.png";
import kpopCover from "../assets/kpop.png";

// Removed local artist/song specific assets as per user's request to use API images.
// These were used for patching covers and mediaSrc, which will now come directly from API.

// ----- cấu hình lịch cập nhật -----
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

// ms đến mốc 2 giờ chẵn tiếp theo: 00:00, 02:00, 04:00, ...
function msUntilNextEvenHour() {
  const now = new Date();
  const currHour = now.getHours();
  const nextEvenHour = (Math.floor(currHour / 2) * 2 + 2) % 24;

  const next = new Date(now);
  next.setHours(nextEvenHour, 0, 0, 0);
  // nếu qua ngày (VD 23:xx → nextEvenHour = 0)
  if (next <= now) next.setDate(next.getDate() + 1);

  return next - now;
}

/* ---------- utils ---------- */
// Removed as no longer used (norm, TITLE_TO_MP3)

export default function useZingChart() {
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);
  const [error, setError]     = useState(null);

  const intervalRef = useRef(null);
  const timeoutRef  = useRef(null);
  const mountedRef  = useRef(true);

  // tiles banner dưới
  const tiles = useMemo(
    () => [
      { code: "vn", cover: vnCover },
      { code: "usuk", cover: usukCover },
      { code: "kpop", cover: kpopCover },
    ],
    []
  );

  // pickCover function removed as per user's request to use API images

  // gọi API + patch top3 (cover, mediaSrc, percent)
  const fetchData = useCallback(
    async (signal) => {
      try {
        setError(null);
        const realtime = await getRealtimeChart(signal); // GET /api/charts/realtime
        if (!realtime) return; // phòng case ETag trả 304

        // Ensure mediaSrc is present for playable items, with a fallback if Backend doesn't provide it
        const patchedRealtime = {
          ...realtime,
          top3: (realtime?.top3 ?? []).map(s => ({
            ...s,
            mediaSrc: s.mediaSrc || s.audioUrl || "" // Fallback to empty string if no mediaSrc from backend
          })),
          items: (realtime?.items ?? []).map(s => ({
            ...s,
            mediaSrc: s.mediaSrc || s.audioUrl || "" // Fallback to empty string if no mediaSrc from backend
          })),
        };
        if (mountedRef.current) setData(patchedRealtime);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, no need to set error.
        } else {
          if (mountedRef.current) setError(err instanceof Error ? err.message : "Fetch failed");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [] // Dependencies adjusted as pickCover is removed
  );

  // căn mốc 2 tiếng: fetch ngay, chờ tới mốc 2h tiếp theo → fetch, rồi lặp 2h/lần
  useEffect(() => {
    mountedRef.current = true;
    const ac = new AbortController();

    const clearTimers = () => {
      if (timeoutRef.current)  { clearTimeout(timeoutRef.current);  timeoutRef.current = null; }
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };

    // 1) lần đầu
    setLoading(true);
    fetchData(ac.signal);

    // 2) chờ đến mốc 2 giờ tiếp theo, sau đó setInterval 2 giờ
    const schedule = () => {
      clearTimers();
      timeoutRef.current = setTimeout(() => {
        fetchData(); // đến mốc → refresh
        intervalRef.current = setInterval(() => {
          fetchData();
        }, TWO_HOURS_MS); // lặp đều mỗi 2 giờ
      }, msUntilNextEvenHour());
    };
    schedule();

    // 3) tự cập nhật khi tab visible
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchData();   // quay lại tab → làm mới
        schedule();    // căn lại lịch (phòng máy ngủ/đổi giờ)
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountedRef.current = false;
      clearTimers();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchData]);

  // làm mới thủ công
  const refresh = useCallback(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
  }, [fetchData]);

  // dữ liệu đã map sẵn cho Recharts
  const chartDataset = useMemo(() => {
    // Use lineChartData directly as provided by Backend
    return data?.lineChartData || [];
  }, [data]);

  return { loading, data, chartDataset, tiles, error, refresh, lineChartMetadata: data?.lineChartMetadata };
}
