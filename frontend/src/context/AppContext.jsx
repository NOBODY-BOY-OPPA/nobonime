import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('nobonime_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      // Nettoyage immédiat si le JSON est corrompu pour éviter le crash de l'app
      localStorage.removeItem('nobonime_user');
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('nobonime_token') || null);

  const login = (userData, tokenValue) => {
    localStorage.setItem('nobonime_user', JSON.stringify(userData));
    localStorage.setItem('nobonime_token', tokenValue);
    setUser(userData);
    setToken(tokenValue);
  };

  const logout = () => {
    localStorage.removeItem('nobonime_user');
    localStorage.removeItem('nobonime_token');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({
    language,
    setLanguage: (next) => { localStorage.setItem('lang', next); setLanguage(next); },
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  }), [language, user, token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
