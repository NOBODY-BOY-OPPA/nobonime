import { useApp } from '../context/AppContext';

export default function Settings() {
  const { language, setLanguage, user } = useApp();
  const fr = language === 'fr';

  return (
    <section className="hero compact">
      <p className="eyebrow">NOBONIME</p>
      <h1>{fr ? 'Paramètres' : 'Settings'}</h1>
      <p>{fr
        ? 'Choisissez votre langue et vos préférences de lecture.'
        : 'Choose your language and playback preferences.'}</p>

      <div style={{ marginTop: 40, display: 'grid', gap: 14, maxWidth: 460 }}>

        {/* Language */}
        <div className="glass" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <b style={{ display: 'block', marginBottom: 4 }}>
              {fr ? 'Langue de l\'interface' : 'Interface language'}
            </b>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              {fr ? 'Français / Anglais' : 'French / English'}
            </span>
          </div>
          <button
            className="button"
            style={{ marginTop: 0, padding: '10px 16px', fontSize: 14 }}
            onClick={() => setLanguage(fr ? 'en' : 'fr')}
          >
            {fr ? '🇬🇧 Switch to English' : '🇫🇷 Passer en français'}
          </button>
        </div>

        {/* Video */}
        <div className="glass" style={{ padding: '20px 24px' }}>
          <b style={{ display: 'block', marginBottom: 4 }}>
            {fr ? 'Lecteur vidéo' : 'Video player'}
          </b>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            {fr
              ? 'HLS adaptatif activé · Métadonnées AniSkip (OP/ED)'
              : 'Adaptive HLS enabled · AniSkip metadata (OP/ED)'}
          </span>
        </div>

        {/* Manga */}
        <div className="glass" style={{ padding: '20px 24px' }}>
          <b style={{ display: 'block', marginBottom: 4 }}>
            {fr ? 'Lecteur manga' : 'Manga reader'}
          </b>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            {fr
              ? 'Mode vertical (webtoon) · Préchargement des 3 premières pages'
              : 'Vertical mode (webtoon) · First 3 pages preloaded'}
          </span>
        </div>

        {/* Account */}
        {user && (
          <div className="glass" style={{ padding: '20px 24px' }}>
            <b style={{ display: 'block', marginBottom: 4 }}>
              {fr ? 'Compte connecté' : 'Signed-in account'}
            </b>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{user.email}</span>
          </div>
        )}

      </div>
    </section>
  );
}
