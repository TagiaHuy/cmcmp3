// src/hooks/useSongsByIds.js
import { useState, useEffect, useMemo } from "react";
import { getSongById } from "../services/songService";
import { useMediaPlayer } from "../context/MediaPlayerContext";

const useSongsByIds = (songIds = []) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // lấy hàm normalizeArtists từ context
  const { normalizeArtists } = useMediaPlayer();

  // loại trùng + ổn định đầu vào
  const uniqueIds = useMemo(() => {
    return Array.isArray(songIds) ? Array.from(new Set(songIds)) : [];
  }, [songIds]);

  const idsKey = useMemo(() => uniqueIds.join(","), [uniqueIds]);

  useEffect(() => {
    let cancelled = false;

    if (!idsKey) {
      setSongs([]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled(
          uniqueIds.map((id) => getSongById(id))
        );

        const formatted = results
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value)
          .map((raw) => {
            const artistText = normalizeArtists(raw.artists);

            return {
              id: raw.id,
              title: raw.title,
              artists: artistText,
              imageUrl: raw.imageUrl || "",
              mediaSrc: raw.mediaSrc, // service đã map đúng
              listenCount: raw.listenCount,
              likeCount: raw.likeCount,
              description: raw.description,
              createdAt: raw.createdAt,
              label: raw.label,
            };
          });

        if (!cancelled) setSongs(formatted);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [idsKey, normalizeArtists]);

  return { songs, loading, error };
};

export default useSongsByIds;
