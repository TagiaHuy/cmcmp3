// src/hooks/useZingChart.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { getRealtimeChart } from "../services/chartService";

// Banner tuần (FE)
import vnCover from "../assets/vn.png";
import usukCover from "../assets/usuk.png";
import kpopCover from "../assets/kpop.png";

// Cover top3 (FE)
import SonTung from "../assets/SonTung.jpg";
import PhanManhQuynh from "../assets/PhanManhQuynh.jpg";
import QuangDangTran from "../assets/QuangDangTran.jpg";

// Nhạc local (FE) — đặt file mp3 trong src/assets hoặc public/audio
import amThamBenEmMP3 from "../assets/Am-tham-ben-em.mp3";
import khiPhaiQuenDiMP3 from "../assets/Khi-phai-quen-di.mp3";
import anhDaKhongBietCachYeuEm from "../assets/Anh-Da-Khong-Biet-Cach-Yeu-Em.mp3"; 

/* ---------- utils ---------- */
const norm = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// map tiêu đề -> mp3 cục bộ (FE)
const TITLE_TO_MP3 = {
  "am tham ben em": amThamBenEmMP3,
  "khi phai quen di": khiPhaiQuenDiMP3,
  // chưa có file thật: dùng tạm sample
  "anh da khong biet cach yeu em": anhDaKhongBietCachYeuEm,
};

export default function useZingChart() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // tiles banner dưới
  const tiles = useMemo(
    () => [
      { code: "vn", cover: vnCover },
      { code: "usuk", cover: usukCover },
      { code: "kpop", cover: kpopCover },
    ],
    []
  );

  // Chọn cover: ưu tiên theo tên bài, sau đó theo nghệ sĩ, rồi fallback theo rank
  const pickCover = useCallback((artists = "", title = "", rank) => {
    const a = norm(artists);
    const t = norm(title);
    const r = Number(rank);

    // 1) Theo tên bài (tránh match nhầm nghệ sĩ)
    if (t.includes("am tham ben em")) return SonTung;
    if (t.includes("khi phai quen di") || t.includes("khi phai quen")) return PhanManhQuynh;
    if (t.includes("anh da khong biet cach yeu em") || t.includes("anh da khong biet"))
      return QuangDangTran;

    // 2) Theo nghệ sĩ (chịu được “feat.”, “x”, …)
    if (a.includes("son tung")) return SonTung;
    if (a.includes("phan manh quynh")) return PhanManhQuynh;
    if (a.includes("quang dang tran")) return QuangDangTran;

    // 3) Fallback cứng theo thứ hạng
    if (r === 1) return SonTung;
    if (r === 2) return PhanManhQuynh;
    if (r === 3) return QuangDangTran;

    return undefined;
  }, []);

  const fetchData = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const realtime = await getRealtimeChart(signal);

        const patched = {
          ...realtime,
          top3: (realtime?.top3 ?? []).map((s) => {
            const titleKey = norm(s.title);
            const localSrc =
              TITLE_TO_MP3[titleKey] ||
              // các biến thể rút gọn
              (titleKey.includes("am tham ben em") && TITLE_TO_MP3["am tham ben em"]) ||
              (titleKey.includes("khi phai quen") && TITLE_TO_MP3["khi phai quen di"]) ||
              (titleKey.includes("anh da khong biet") &&
                TITLE_TO_MP3["anh da khong biet cach yeu em"]);

            return {
              ...s,
              // ảnh ưu tiên FE, nếu không có dùng từ BE (nếu BE trả)
              cover: pickCover(s.artists, s.title, s.rank) || s.cover || undefined,
              // nguồn audio: ưu tiên FE, nếu không có thì dùng s.mediaSrc từ BE, cuối cùng fallback sample
              mediaSrc: localSrc || s.mediaSrc || anhDaKhongBietCachYeuEm,
            };
          }),
        };

        setData(patched);
      } catch (err) {
        console.error("Lỗi tải realtime:", err);
        setError(err instanceof Error ? err.message : "Fetch failed");
      } finally {
        setLoading(false);
      }
    },
    [pickCover]
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
    return () => ac.abort();
  }, [fetchData]);

  // làm mới thủ công
  const refresh = useCallback(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
  }, [fetchData]);

  return { loading, data, tiles, error, refresh };
}
