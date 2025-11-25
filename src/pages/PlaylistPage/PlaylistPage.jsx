import { useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import '../../styles/PlaylistPage.css';

export default function DetailPage() {
  useEffect(() => { document.title = buildTitle('Detail Playlist'); }, []);

  return (
    <section className="playlist-container" aria-labelledby="detail-playlist">
      <h1 id="playlist-title" className="playlist-title">
        Créer une page de détail pour afficher les informations d'une playlist Spotify spécifique.
        <br />
        Dans un premier temps mettre en place une page statique avec uniquement un titre afin de vérifier que la navigation fonctionne correctement.
      </h1>
    </section>
  );
}