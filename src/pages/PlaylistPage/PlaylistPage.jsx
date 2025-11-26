import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buildTitle } from '../../constants/appMeta.js';
import '../../styles/PlaylistPage.css';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchPlaylistById } from '../../api/spotify-playlists.js';
import TrackItem from '../../components/TrackItem/TrackItem.jsx';

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, checking } = useRequireToken();

  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { document.title = buildTitle('Playlist'); }, []);

  useEffect(() => {
    if (checking) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPlaylistById(token, id);

        if (result?.error) {
          if (result.error === 'The access token expired') {
            navigate('/login', { replace: true });
            return;
          }
          setError(result.error);
          setPlaylist(null);
        } else {
          setPlaylist(result.data);
        }
      } catch (err) {
        setError(err?.message || 'Failed to fetch playlist');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [checking, token, id, navigate]);

  if (loading) {
    return (
      <section className="playlist-container page-container" role="status">
        <div data-testid="loading-indicator">Loading playlist...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="playlist-container page-container">
        <div role="alert">{error}</div>
      </section>
    );
  }

  if (!playlist) {
    return (
      <section className="playlist-container page-container">
        <div role="alert">Playlist not found.</div>
      </section>
    );
  }

  const { name, description, images, external_urls } = playlist;

  return (
    <section className="playlist-container page-container" aria-labelledby="playlist-title">
      <h1 id="playlist-title" className="playlist-title page-title">{name}</h1>
      {images && images[0] && (
        <img src={images[0].url} alt={`Cover of ${name}`} className="playlist-cover" />
      )}
      <h2 className="playlist-subtitle page-subtitle">{description}</h2>

      <p>
        <a href={external_urls?.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
      </p>

      <ol className="playlist-list">
        {playlist.tracks?.items?.map((item) => (
          <TrackItem key={item.track.id} track={item.track} />
        ))}
      </ol>
    </section>
  );
}