// src/hooks/useSong.js
import { useState, useEffect, useCallback } from "react";
import { getSongById, updateSongLyrics, isCurrentUserUploader } from "../services/songService";

const useSong = (songId) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploader, setIsUploader] = useState(false); // New state for uploader status

  useEffect(() => {
    if (!songId) {
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    const fetchSong = async () => {
      try {
        setLoading(true);

        // 🎯 Bản song đã được normalize trong service
        const fetchedSong = await getSongById(songId, ac.signal);
        setSong(fetchedSong || null);

        // Fetch uploader status
        const uploaderStatus = await isCurrentUserUploader(songId, ac.signal);
        setIsUploader(uploaderStatus);

      } catch (err) {
        if (err?.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
    return () => ac.abort();
  }, [songId]);

  const updateLyrics = useCallback(async (newLyrics) => {
    if (!songId) {
      throw new Error("Cannot update lyrics: songId is not provided.");
    }
    try {
      // Assuming updateSongLyrics returns the updated song object
      const updatedSong = await updateSongLyrics(songId, newLyrics);
      setSong(updatedSong); // Update local state with the newly updated song
      return updatedSong;
    } catch (err) {
      console.error("Failed to update lyrics:", err);
      setError(err);
      throw err;
    }
  }, [songId]);

  return { song, loading, error, isUploader, updateLyrics };
};

export default useSong;
