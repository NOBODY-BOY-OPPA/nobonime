import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser } from '../api';

export default function Login() {
  const { language, login } = useApp();
  const fr       = language === 'fr';
  const navigate = useNavigate();

  const [mode, setMode]     = useState('login'); // 'login' | 'register'
  const [form, setForm]     = useState({ email: '', password: '', name: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = mode === 'login'
        ? await loginUser(form.email, form.password)
        : await registerUser(form.email, form.password, form.name);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); };

  return (
    <section className="hero compact">
      <p className="eyebrow">NOBONIME</p>
      <h1>
        {mode === 'login'
          ? (fr ? 'Connexion' : 'Sign in')
          : (fr ? 'Créer un compte' : 'Create account')}
      </h1>
      <p>{fr
        ? 'Accédez à votre historique, vos favoris et votre progression manga.'
        : 'Access your watch history, favorites and manga progress.'}</p>

      <form className="admin-form" onSubmit={submit} style={{ marginTop: 32 }}>
        {mode === 'register' && (
          <input
            required
            placeholder={fr ? 'Votre nom' : 'Your name'}
            value={form.name}
            onChange={set('name')}
            minLength={2}
            maxLength={80}
          />
        )}
        <input
          required
          type="email"
          placeholder={fr ? 'Adresse e-mail' : 'Email address'}
          value={form.email}
          onChange={set('email')}
        />
        <input
          required
          type="password"
          placeholder={fr ? 'Mot de passe (8 caractères min.)' : 'Password (8 chars min.)'}
          value={form.password}
          onChange={set('password')}
          minLength={8}
        />
        <button
          className="button"
          type="submit"
          disabled={loading}
          style={{ justifyContent: 'center', opacity: loading ? 0.65 : 1 }}
        >
          {loading
            ? '…'
            : mode === 'login'
              ? (fr ? 'Se connecter' : 'Sign in')
              : (fr ? 'Créer le compte' : 'Create account')}
        </button>
      </form>

      {error && <p className="notice error" style={{ marginTop: 16 }}>{error}</p>}

      <p style={{ marginTop: 22, color: 'var(--muted)', fontSize: 14 }}>
        {mode === 'login'
          ? (fr ? 'Pas encore de compte ? ' : 'No account yet? ')
          : (fr ? 'Déjà un compte ? ' : 'Already have an account? ')}
        <button className="link-btn" onClick={switchMode}>
          {mode === 'login'
            ? (fr ? 'Créer un compte' : 'Create account')
            : (fr ? 'Se connecter' : 'Sign in')}
        </button>
      </p>
    </section>
  );
}
