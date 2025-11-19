import { useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import '../../styles/DashboardPage.css';

export default function DashboardPage() {
  useEffect(() => { document.title = buildTitle('Dashboard'); }, []);

  return (
    <section className="dashboard-container page-container" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="dashboard-title page-title">
        Créer un nouveau composant React DashboardPage qui sera responsable de l'affichage des informations du tableau de bord.
        <br />
        Dans un premier temps mettre en place une page statique avec uniquement un titre afin de vérifier que la navigation fonctionne correctement.
      </h1>
    </section>
  );
}
