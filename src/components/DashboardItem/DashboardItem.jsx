import './../../styles/DashboardPage.css';
import SimpleCard from '../SimpleCard/SimpleCard.jsx';

export default function DashboardItem({ artist, track }) {
	// If both provided, prefer artist rendering for the artist card
	if (artist) {
		const imageUrl = artist.images?.[0]?.url || '';
		const subtitle = artist.genres?.length ? artist.genres.join(', ') : '';
		return (
			<div data-testid={artist.id ? `dashboard-artist-${artist.id}` : undefined}>
				<SimpleCard imageUrl={imageUrl} title={artist.name} subtitle={subtitle} link={artist.external_urls?.spotify} />
			</div>
		);
	}

	if (track) {
		const imageUrl = track.album?.images?.[0]?.url || '';
		const subtitle = (track.artists || []).map(a => a.name).join(', ');
		return (
			<div data-testid={track.id ? `dashboard-track-${track.id}` : undefined}>
				<SimpleCard imageUrl={imageUrl} title={track.name} subtitle={subtitle} link={track.external_urls?.spotify} />
			</div>
		);
	}




	return null;
}
