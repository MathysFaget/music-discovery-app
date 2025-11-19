import './../../styles/DashboardPage.css';
import { useEffect, useState } from 'react';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchUserTopTracks } from '../../api/spotify-me.js';

export default function DashboardItem({ artist }) {
	const { token } = useRequireToken();
	const [topTrack, setTopTrack] = useState(null);
	const [trackError, setTrackError] = useState(null);

	if (!artist) return null;

	const imageUrl = artist.images?.[1]?.url || artist.images?.[0]?.url || '';
	const genres = artist.genres?.length ? artist.genres.join(', ') : 'Unknown genres';

	useEffect(() => {
		if (!token) return;

		// fetch top tracks and log result
		fetchUserTopTracks(token, 1)
			.then(res => {
				if (res.error) {
					setTrackError(res.error);
					console.error('fetchUserTopTracks error:', res.error);
					return;
				}
				console.log('fetchUserTopTracks response:', res.data);
				setTopTrack(res.data?.items?.[0] ?? null);
			})
			.catch(err => {
				setTrackError(err?.message || String(err));
				console.error('fetchUserTopTracks exception:', err);
			});
	}, [token]);

	return (
		<>
			<div className="card" data-testid={`dashboard-artist-${artist.id}`}>
				{imageUrl && <img src={imageUrl} alt={artist.name} style={{ width: '100%', borderRadius: 6, marginBottom: 12 }} />}
				<h2>{artist.name}</h2>
				<p>Genres: {genres}</p>
			</div>

			<div style={{ marginTop: 12 }}>
				{trackError && <div className="dashboard-error" data-testid="error-top-track">{trackError}</div>}
				{topTrack ? (
					<div className="card" data-testid={`dashboard-top-track-${topTrack.id}`}>
						{topTrack.album?.images?.[1]?.url && (
							<img src={topTrack.album.images[1].url} alt={topTrack.name} style={{ width: '100%', borderRadius: 6, marginBottom: 12 }} />
						)}
						<h2>{topTrack.name}</h2>
						<p>By: {topTrack.artists?.map(a => a.name).join(', ')}</p>
					</div>
				) : (
					<p data-testid="no-top-track">No top track available yet.</p>
				)}
			</div>
		</>
	);
}
