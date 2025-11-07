// src/hooks/useZingChart.js
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { getRealtimeChart } from "../services/chartService";

// Banner tuần (FE)
import vnCover from "../assets/vn.png";
import usukCover from "../assets/usuk.png";
import kpopCover from "../assets/kpop.png";

// Cover top3 (FE)
import SonTung from "../assets/SonTung.jpg";
import PhanManhQuynh from "../assets/PhanManhQuynh.jpg";
import QuangDangTran from "../assets/QuangDangTran.jpg";

// Nhạc local (FE)
import amThamBenEmMP3 from "../assets/Am-tham-ben-em.mp3";
import khiPhaiQuenDiMP3 from "../assets/Khi-phai-quen-di.mp3";
import anhDaKhongBietCachYeuEm from "../assets/Anh-Da-Khong-Biet-Cach-Yeu-Em.mp3";

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
const norm = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// map tiêu đề -> mp3 cục bộ (FE)
const TITLE_TO_MP3 = {
  "am tham ben em": amThamBenEmMP3,
  "khi phai quen di": khiPhaiQuenDiMP3,
  "anh da khong biet cach yeu em": anhDaKhongBietCachYeuEm,
};

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

  // Chọn cover: ưu tiên theo tên bài, sau đó nghệ sĩ, rồi fallback theo rank
  const pickCover = useCallback((artists = "", title = "", rank) => {
    const a = norm(artists);
    const t = norm(title);
    const r = Number(rank);

    if (t.includes("am tham ben em")) return SonTung;
    if (t.includes("khi phai quen di") || t.includes("khi phai quen")) return PhanManhQuynh;
    if (t.includes("anh da khong biet cach yeu em") || t.includes("anh da khong biet"))
      return QuangDangTran;

    if (a.includes("son tung")) return SonTung;
    if (a.includes("phan manh quynh")) return PhanManhQuynh;
    if (a.includes("quang dang tran")) return QuangDangTran;

    if (r === 1) return SonTung;
    if (r === 2) return PhanManhQuynh;
    if (r === 3) return QuangDangTran;
    return undefined;
  }, []);

  // gọi API + patch top3 (cover, mediaSrc)
  const fetchData = useCallback(
    async (signal) => {
      try {
        setError(null);
        const realtime = await getRealtimeChart(signal); // GET /api/charts/realtime
        if (!realtime) return; // phòng case ETag trả 304

        const patched = {
          ...realtime,
          top3: (realtime?.top3 ?? []).map((s) => {
            const titleKey = norm(s.title);
            const localSrc =
              TITLE_TO_MP3[titleKey] ||
              (titleKey.includes("am tham ben em") && TITLE_TO_MP3["am tham ben em"]) ||
              (titleKey.includes("khi phai quen") && TITLE_TO_MP3["khi phai quen di"]) ||
              (titleKey.includes("anh da khong biet") &&
                TITLE_TO_MP3["anh da khong biet cach yeu em"]);

            return {
              ...s,
              cover: pickCover(s.artists, s.title, s.rank) || s.cover || undefined,
              mediaSrc: localSrc || s.mediaSrc || anhDaKhongBietCachYeuEm,
            };
          }),
        };

        if (mountedRef.current) setData(patched);
      } catch (err) {
        if (mountedRef.current) setError(err instanceof Error ? err.message : "Fetch failed");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [pickCover]
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
      ac.abort();
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
    if (!data?.timeline) return [];
    const { timeline, vn = [], usuk = [], kpop = [] } = data;
    return timeline.map((t, i) => ({
      time: t,
      vn: vn[i],
      usuk: usuk[i],
      kpop: kpop[i],
    }));
  }, [data]);

  return { loading, data, chartDataset, tiles, error, refresh };
}
