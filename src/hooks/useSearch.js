import { useState, useEffect } from 'react';
import { search } from '../services/searchService';
import API_BASE_URL from '../config';

const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Khi query rỗng → reset kết quả
    if (!query || query.trim() === "") {
      setResults([]);
      setError(null);
      return;
    }

    let isCancelled = false;

    const fetchSearch = async () => {
      try {
        setLoading(true);
        setError(null); // Reset lỗi trước khi fetch mới

        const searchResults = await search(query);
        const allFormattedResults = [];

        // 1. Xử lý kết quả Songs (Bài hát)
        if (searchResults?.songs && searchResults.songs.length > 0) {
          const songResults = searchResults.songs.map(song => ({
            type: 'song', // Thêm trường type
            id: song.id,
            title: song.title,
            artists: song.artist, // 'artist' trong API, đổi thành 'artists' cho đồng nhất
            imageUrl: song.imageUrl,
            mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
          }));
          allFormattedResults.push(...songResults);
        }

        // 2. Xử lý kết quả Artists (Nghệ sĩ)
        if (searchResults?.artists && searchResults.artists.length > 0) {
          const artistResults = searchResults.artists.map(artist => ({
            type: 'artist', // Thêm trường type
            id: artist.id,
            title: artist.name, // Dùng 'name' làm 'title' để hiển thị
            imageUrl: artist.imageUrl,     // Có thể thêm ảnh nghệ sĩ nếu API hỗ trợ
          }));
          allFormattedResults.push(...artistResults);
        }

        // 3. Xử lý kết quả Playlists (Danh sách phát)
        if (searchResults?.playlists && searchResults.playlists.length > 0) {
          const playlistResults = searchResults.playlists.map(playlist => ({
            type: 'playlist', // Thêm trường type
            id: playlist.id,
            title: playlist.name, // Dùng 'name' làm 'title'
            description: playlist.description,
            imageUrl: playlist.imageUrl,
          }));
          allFormattedResults.push(...playlistResults);
        }

        // Chỉ update nếu effect chưa bị cleanup
        if (!isCancelled) {
          // Gộp tất cả kết quả lại thành một mảng duy nhất
          setResults(allFormattedResults);
        }

      } catch (err) {
        if (!isCancelled) {
          setError(err);
          setResults([]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    // Tăng thời gian Debounce lên 300ms để tối ưu hiệu suất (khuyến nghị)
    const debounceTimer = setTimeout(fetchSearch, 300);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [query]);

  return { results, loading, error };
};

export default useSearch;