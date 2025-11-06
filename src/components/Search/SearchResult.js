import React from 'react';

function SearchResult({ results }) {
  if (!results || (!results.songs.length && !results.artists.length && !results.playlists.length)) {
    return null;
  }

  return (
    <div style={{ position: 'absolute', top: '50px', width: '500px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', zIndex: 1000 }}>
      {results.songs.length > 0 && (
        <div>
          <h3 style={{ padding: '10px', margin: 0, borderBottom: '1px solid #eee' }}>Songs</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {results.songs.map((song) => (
              <li key={song.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{song.title} by {song.artist}</li>
            ))}
          </ul>
        </div>
      )}
      {results.artists.length > 0 && (
        <div>
          <h3 style={{ padding: '10px', margin: 0, borderBottom: '1px solid #eee' }}>Artists</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {results.artists.map((artist) => (
              <li key={artist.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{artist.name}</li>
            ))}
          </ul>
        </div>
      )}
      {results.playlists.length > 0 && (
        <div>
          <h3 style={{ padding: '10px', margin: 0, borderBottom: '1px solid #eee' }}>Playlists</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {results.playlists.map((playlist) => (
              <li key={playlist.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{playlist.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchResult;
