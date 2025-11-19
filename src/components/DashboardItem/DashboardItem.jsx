import './DashboardItem.css';

export default function DashboardItem({ artist }) {
	if (!artist) return null;

	const imageUrl = artist.images?.[1]?.url || artist.images?.[0]?.url || '';
	const genres = artist.genres?.length ? artist.genres.join(', ') : 'Unknown genres';

	return (
		<article className="dashboard-item" data-testid={`dashboard-artist-${artist.id}`}>
			{imageUrl && <img src={imageUrl} alt={artist.name} className="dashboard-item__img" />}
			<div className="dashboard-item__body">
				<h2 className="dashboard-item__title">{artist.name}</h2>
				<p className="dashboard-item__genres">{genres}</p>
			</div>
		</article>
	);
}
