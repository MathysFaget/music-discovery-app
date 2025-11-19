import { useEffect, useState } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import DashboardItem from '../../components/DashboardItem/DashboardItem.jsx';
import '.DashboardPage.css';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchUserTopArtists } from '../../api/spotify-me.js';

const LIMIT = 5;

export default function DashboardPage() {
  const { token } = useRequireToken();
  const [topArtists, setTopArtists] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { document.title = buildTitle('Dashboard'); }, []);

  useEffect(() => {
    if (!token) return; // wait for auth

    // fetch top artists and log result to console (for debug / inspect format)
    fetchUserTopArtists(token, LIMIT)
      .then(res => {
        if (res.error) {
          setError(res.error);
          console.error('fetchUserTopArtists error:', res.error);
          return;
        }
        console.log('fetchUserTopArtists response:', res.data);
        setTopArtists(res.data);
      })
      .catch(err => {
        setError(err?.message || String(err));
        console.error('fetchUserTopArtists exception:', err);
      });
  }, [token]);

  // show simple UI: title + DashboardItem for first artist (if available)
  return (
    <section className="dashboard-container page-container" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="dashboard-title page-title">Dashboard</h1>

      {error && <div className="dashboard-error" role="alert">{error}</div>}

      {!token && <p>Log in to see your dashboard.</p>}

      {topArtists?.items?.[0] ? (
        <DashboardItem artist={topArtists.items[0]} />
      ) : (
        <p data-testid="no-artist">No top artist available yet.</p>
      )}
    </section>
  );
}
