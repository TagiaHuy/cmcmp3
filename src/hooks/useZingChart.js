// src/hooks/useZingChart.js
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { getRealtimeChart } from "../services/chartService";
import API_BASE_URL from "../config";

// Banner tuần (FE)
import vnCover from "../assets/vn.png";
import usukCover from "../assets/usuk.png";
import kpopCover from "../assets/kpop.png";

// ----- cấu hình lịch cập nhật theo mốc 2 giờ -----
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

// Tính ms đến mốc 2 giờ chẵn tiếp theo: 00:00, 02:00, 04:00, ...
function msUntilNextEvenHour() {
  const now = new Date();
  const currHour = now.getHours();

  // Giờ chẵn tiếp theo (0,2,4,...,22)
  const nextEvenHour = (Math.floor(currHour / 2) * 2 + 2) % 24;

  const next = new Date(now);
  next.setHours(nextEvenHour, 0, 0, 0);

  // Nếu đã quá giờ đó thì nhảy sang ngày hôm sau
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next - now;
}

export default function useZingChart() {
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);
  const [error, setError]     = useState(null);

  const intervalRef = useRef(null);
  const timeoutRef  = useRef(null);
  const mountedRef  = useRef(true);

  // tiles banner dưới (fake, theo đúng UI hiện tại)
  const tiles = useMemo(
    () => [
      { code: "vn",   cover: vnCover },
      { code: "usuk", cover: usukCover },
      { code: "kpop", cover: kpopCover },
    ],
    []
  );

  // Gọi API + patch thêm mediaSrc cho top3 & items
  const fetchData = useCallback(
    async (signal) => {
      try {
        setError(null);
        const realtime = await getRealtimeChart(signal); // GET /api/charts/realtime

        // Phòng case dùng ETag / cache control trả 304
        if (!realtime) return;

        const patchedRealtime = {
          ...realtime,
          top3: (realtime?.top3 ?? []).map((s) => ({
            ...s,
            mediaSrc: `${API_BASE_URL}/api/songs/stream/${s.id}`,
          })),
          items: (realtime?.items ?? []).map((s) => ({
            ...s,
            mediaSrc: `${API_BASE_URL}/api/songs/stream/${s.id}`,
          })),
        };

        if (mountedRef.current) {
          setData(patchedRealtime);
        }
      } catch (err) {
        // Bị abort do unmount / đổi tab → bỏ qua
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : "Fetch failed");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  // căn mốc 2 tiếng: fetch ngay, chờ tới mốc 2h tiếp theo → fetch, rồi lặp 2h/lần
  useEffect(() => {
    mountedRef.current = true;
    const ac = new AbortController();

    const clearTimers = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // 1) lần đầu: load ngay
    setLoading(true);
    fetchData(ac.signal);

    // 2) chờ đến mốc 2 giờ tiếp theo, sau đó setInterval 2 giờ
    const schedule = () => {
      clearTimers();

      // chờ tới mốc 2h chẵn tiếp theo
      timeoutRef.current = setTimeout(() => {
        // đến mốc → refresh 1 lần
        fetchData();

        // rồi cứ 2h/lần
        intervalRef.current = setInterval(() => {
          fetchData();
        }, TWO_HOURS_MS);
      }, msUntilNextEvenHour());
    };

    schedule();

    // 3) tự cập nhật khi tab visible lại
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchData();   // quay lại tab → refresh ngay
        schedule();    // căn lại lịch phòng máy sleep / đổi giờ
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountedRef.current = false;
      ac.abort();      // hủy request đầu tiên nếu còn đang chạy
      clearTimers();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchData]);

  // Làm mới thủ công (nút "refresh" nếu sau này bạn thêm)
  const refresh = useCallback(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
  }, [fetchData]);

  // Dataset cho Recharts: dùng trực tiếp lineChartData từ BE
  const chartDataset = useMemo(() => {
    return data?.lineChartData || [];
  }, [data]);

  // Metadata cho từng line: tên bài, nghệ sĩ, cover,...
  const lineChartMetadata = useMemo(() => {
    return data?.lineChartMetadata || {};
  }, [data]);

  return {
    loading,
    data,
    chartDataset,       // dùng cho <LineChart data={chartDataset} ... />
    tiles,
    error,
    refresh,
    lineChartMetadata,  // dùng cho tooltip hiển thị tên bài / ảnh
  };
}
