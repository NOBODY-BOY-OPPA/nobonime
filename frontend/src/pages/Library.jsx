import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getHistory } from '../api';

export default function Library() {
  const { language, isAuthenticated } = useApp();
  const fr = language === 'fr';
  const [data, setData]   = useState({ watchHistory: [], chapterProgress: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getHistory()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <section className="hero compact">
        <p className="eyebrow">NOBONIME</p>
        <h1>{fr ? 'Votre bibliothèque' : 'Your library'}</h1>
        <p>{fr
          ? 'Connectez-vous pour accéder à votre historique et vos favoris.'
          : 'Sign in to access your watch history and favorites.'}</p>
        <Link className="button" to="/login">{fr ? 'Se connecter' : 'Sign in'}</Link>
      </section>
    );
  }

  if (loading) return <div className="empty">{fr ? 'Chargement…' : 'Loading…'}</div>;

  return (
    <section>
      {/* Watch history */}
      <div className="section-title">
        <h2>{fr ? 'Historique de visionnage' : 'Watch history'}</h2>
      </div>
      {error && <p className="notice error">{error}</p>}
      {data.watchHistory.length === 0 && !error && (
        <div className="empty">
          {fr ? 'Aucun contenu visionné pour l\'instant.' : 'Nothing watched yet.'}
        </div>
      )}
      <div className="cards">
        {data.watchHistory.map((item) => (
          <Link
            className="card"
            to={`/watch/${item.mediaId}`}
            key={`${item.mediaId}-${item.episode}`}
          >
            <div className="card-placeholder"/>
            <div>
              <b>{item.title || item.mediaId}</b>
              <span>{fr ? `Ép. ${item.episode}` : `Ep. ${item.episode}`}
                {item.progressSeconds > 0 && ` · ${Math.round(item.progressSeconds / 60)} min`}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Manga progress */}
      <div className="section-title" style={{ marginTop: 60 }}>
        <h2>{fr ? 'Progression manga' : 'Manga progress'}</h2>
      </div>
      {data.chapterProgress.length === 0 && !error && (
        <div className="empty">
          {fr ? 'Aucun manga lu pour l\'instant.' : 'No manga read yet.'}
        </div>
      )}
      <div className="cards">
        {data.chapterProgress.map((item) => (
          <Link
            className="card"
            to={`/manga/${item.mangaId}/${item.chapterId}`}
            key={`${item.mangaId}-${item.chapterId}`}
          >
            <div className="card-placeholder"/>
            <div>
              <b>{item.mangaId}</b>
              <span>{fr
                ? `Chapitre ${item.chapterId} · Page ${item.page}`
                : `Chapter ${item.chapterId} · Page ${item.page}`}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
