import { useEffect, useState } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import SimpleCard from '../../components/SimpleCard/SimpleCard.jsx';
import './../../styles/DashboardPage.css';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchUserTopArtists, fetchUserTopTracks } from '../../api/spotify-me.js';
import { useNavigate } from 'react-router-dom';

const LIMIT = 1; // only the top (most listened) item

export default function DashboardPage() {
  const { token } = useRequireToken();
  const navigate = useNavigate();

  const [topArtist, setTopArtist] = useState(undefined);
  const [topTrack, setTopTrack] = useState(undefined);

  const [artistsError, setArtistsError] = useState(null);
  const [tracksError, setTracksError] = useState(null);

  const artistsLoading = topArtist === undefined && Boolean(token);
  const tracksLoading = topTrack === undefined && Boolean(token);

  useEffect(() => { document.title = buildTitle('Dashboard'); }, []);

  useEffect(() => {
    if (!token) return;

    fetchUserTopArtists(token, LIMIT)
      .then(res => {
        if (res?.error) {
          setArtistsError(res.error);
          console.error('fetchUserTopArtists error:', res.error);
          return;
        }
        console.log('fetchUserTopArtists response:', res.data);
        setTopArtist(res.data?.items?.[0] ?? null);
      })
      .catch(err => {
        setArtistsError(err?.message || String(err));
        console.error('fetchUserTopArtists exception:', err);
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetchUserTopTracks(token, LIMIT)
      .then(res => {
        if (res?.error) {
          setTracksError(res.error);
          console.error('fetchUserTopTracks error:', res.error);
          return;
        }
        console.log('fetchUserTopTracks response:', res.data);
        setTopTrack(res.data?.items?.[0] ?? null);
      })
      .catch(err => {
        setTracksError(err?.message || String(err));
        console.error('fetchUserTopTracks exception:', err);
      });
  }, [token]);

  // redirect to login when token expired
  useEffect(() => {
    const expired = (artistsError && String(artistsError).includes('access token expired'))
      || (tracksError && String(tracksError).includes('access token expired'));
    if (expired) navigate('/login');
  }, [artistsError, tracksError, navigate]);

  return (
    <section className="dashboard-container page-container" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="dashboard-title page-title">Dashboard</h1>
      <p className="dashboard-subtitle">Your top artist and track</p>

      {artistsLoading && <div data-testid="loading-artists-indicator">Loading artists…</div>}
      {tracksLoading && <div data-testid="loading-tracks-indicator">Loading tracks…</div>}

      {artistsError && <div data-testid="error-artists-indicator" className="dashboard-error">{artistsError}</div>}
      {tracksError && <div data-testid="error-tracks-indicator" className="dashboard-error">{tracksError}</div>}

      {!artistsLoading && !tracksLoading && (
        <div className="dashboard-content">
          <div className="card">
            {topArtist ? (
              <SimpleCard
                imageUrl={topArtist.images?.[0]?.url || ''}
                title={topArtist.name}
                subtitle={topArtist.genres?.length ? topArtist.genres.join(', ') : ''}
                link={topArtist.external_urls?.spotify}
              />
            ) : (
              <div className="card"><p data-testid="no-artist">No top artist available yet.</p></div>
            )}
          </div>
          <div className="card">
            {topTrack ? (
              <SimpleCard
                imageUrl={topTrack.album?.images?.[0]?.url || ''}
                title={topTrack.name}
                subtitle={(topTrack.artists || []).map(a => a.name).join(', ')}
                link={topTrack.external_urls?.spotify}
              />
            ) : (
              <div className="card"><p data-testid="no-track">No top track available yet.</p></div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
