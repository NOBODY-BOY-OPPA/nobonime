import { Routes, Route, Link, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Bell, Languages, Home as HomeIcon, Compass,
  Library, BookOpen, Settings, ShieldCheck, LogIn, LogOut, User,
} from 'lucide-react';

// Remplacement des anciens composants par tes nouvelles versions avancées
import CustomHlsPlayer from './components/player/CustomHlsPlayer';
import VerticalWebtoonReader from './components/reader/VerticalWebtoonReader';

import AdminDashboard from './pages/AdminDashboard';
import LibraryPage    from './pages/Library';
import SettingsPage   from './pages/Settings';
import LoginPage      from './pages/Login';
import { catalog }    from './api';
import { useEffect, useState } from 'react';
import { useApp }     from './context/AppContext';

const copy = {
  en: {
    welcome   : 'Your universe, beautifully streamed.',
    subtitle  : 'Anime, manga and stories in one calm place.',
    trending  : 'Trending now',
    view      : 'View all',
    configure : 'Connect a catalog API to populate your library.',
  },
  fr: {
    welcome   : 'Votre univers, en streaming avec élégance.',
    subtitle  : 'Anime, manga et histoires dans un espace serein.',
    trending  : 'Tendances',
    view      : 'Tout voir',
    configure : 'Connectez une API catalogue pour alimenter votre bibliothèque.',
  },
};

/* ── Shell ─────────────────────────────────────────────────── */
function Shell({ children }) {
  const { language, setLanguage, user, logout } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const fr = language === 'fr';

  return (
    <div className="app">
      <aside className="sidebar">
        <Link className="brand" to="/"><span>NO</span>BONIME</Link>
        <nav>
          <NavLink to="/" end><HomeIcon size={18}/> {fr ? 'Accueil' : 'Home'}</NavLink>
          <NavLink to="/discover"><Compass size={18}/> {fr ? 'Découvrir' : 'Discover'}</NavLink>
          <NavLink to="/library"><Library size={18}/> {fr ? 'Bibliothèque' : 'Library'}</NavLink>
          <NavLink to="/manga/one-piece/1"><BookOpen size={18}/> {fr ? 'Mangas' : 'Manga'}</NavLink>
          <NavLink to="/admin"><ShieldCheck size={18}/> Admin</NavLink>
        </nav>
        {user
          ? <button className="settings icon" onClick={logout}><LogOut size={18}/> {fr ? 'Déconnexion' : 'Sign out'}</button>
          : <NavLink className="settings" to="/login"><LogIn size={18}/> {fr ? 'Connexion' : 'Sign in'}</NavLink>
        }
        <NavLink className="settings" to="/settings"><Settings size={18}/> {fr ? 'Paramètres' : 'Settings'}</NavLink>
      </aside>

      <section className="content">
        <header>
          <form
            className="search"
            onSubmit={(e) => { e.preventDefault(); navigate(`/discover${query ? `?q=${encodeURIComponent(query)}` : ''}`); }}
          >
            <Search size={18}/>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={fr ? 'Rechercher anime, manga…' : 'Search anime, manga…'}
            />
          </form>
          <button className="icon" onClick={() => setLanguage(fr ? 'en' : 'fr')}>
            <Languages size={18}/> {language.toUpperCase()}
          </button>
          <Bell size={19}/>
          {user && <span className="user-badge"><User size={15}/> {user.name}</span>}
        </header>
        {children}
      </section>
    </div>
  );
}

/* ── Catalog (Home / Discover) ─────────────────────────────── */
function Catalog({ discover = false }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const location  = useLocation();
  const { language } = useApp();
  const fr = language === 'fr';
  const t  = copy[fr ? 'fr' : 'en'];

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    setError('');
    catalog(q).then((data) => setItems(data.items || [])).catch((e) => setError(e.message));
  }, [location.search]);

  return (
    <>
      {!discover && (
        <section className="hero">
          <p className="eyebrow">NOBONIME</p>
          <h1>{t.welcome}</h1>
          <p>{t.subtitle}</p>
        </section>
      )}
      <div className="section-title">
        <h2>{discover ? (fr ? 'Découvrir' : 'Discover') : t.trending}</h2>
        {!discover && <Link to="/discover">{t.view} →</Link>}
      </div>
      {error && <p className="notice error">{error}</p>}
      {!items.length && !error && <div className="empty">{t.configure}</div>}
      <div className="cards">
        {items.map((item) => (
          // Ajout de "/1" par défaut pour correspondre à la route :animeId/:episodeId
          <Link className="card" to={`/watch/${item.id}/1`} key={item.id}>
            <img src={item.image} alt={item.title}/>
            <div>
              <b>{item.title}</b>
              <span>{item.score ? `★ ${item.score} · ` : ''}{(item.genres || []).join(' · ')}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

/* ── Watch ──────────────────────────────────────────────────── */
function Watch() {
  // Récupération de animeId et episodeId pour CustomHlsPlayer
  const { animeId, episodeId } = useParams();
  const { language } = useApp();
  return (
    <>
      <h1 className="page-title">{language === 'fr' ? 'Lecture en cours' : 'Now playing'}</h1>
      <CustomHlsPlayer animeId={animeId} episodeId={episodeId} />
    </>
  );
}

/* ── Reader ─────────────────────────────────────────────────── */
function ReaderPage() {
  const { mangaId, chapterId } = useParams();
  const { language } = useApp();
  const fr = language === 'fr';
  return (
    <>
      <h1 className="page-title">{fr ? `Lecteur · Chapitre ${chapterId || ''}` : `Reader · Chapter ${chapterId || ''}`}</h1>
      <VerticalWebtoonReader mangaId={mangaId} chapterId={chapterId} />
    </>
  );
}

/* ── App ────────────────────────────────────────────────────── */
export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/"                                  element={<Catalog/>}/>
        <Route path="/discover"                          element={<Catalog discover/>}/>
        <Route path="/library"                           element={<LibraryPage/>}/>
        <Route path="/settings"                          element={<SettingsPage/>}/>
        <Route path="/login"                             element={<LoginPage/>}/>
        <Route path="/admin"                             element={<AdminDashboard/>}/>
        
        {/* Mise à jour des routes pour correspondre à la logique de tes composants */}
        <Route path="/watch/:animeId/:episodeId"         element={<Watch/>}/>
        <Route path="/manga/:mangaId"                    element={<ReaderPage/>}/>
        <Route path="/manga/:mangaId/:chapterId"         element={<ReaderPage/>}/>
        
        <Route path="*"                                  element={<Catalog/>}/>
      </Routes>
    </Shell>
  );
}
