const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function api(path, options = {}) {
  const token = localStorage.getItem('nobonime_token');
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Catalog
export const catalog = (query = '') =>
  api(`/catalog${query ? `?query=${encodeURIComponent(query)}` : ''}`);
export const stream = (id) => api(`/catalog/${id}/stream`);

// Manga
export const chapter = (manga, id) => api(`/manga/${manga}/chapters/${id}`);

// Auth
export const loginUser    = (email, password) =>
  api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const registerUser = (email, password, name) =>
  api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) });
export const getMe = () => api('/auth/me');

// History
export const getHistory = () => api('/auth/history');
export const updateWatchHistory = (entry) =>
  api('/auth/history/watch', { method: 'PUT', body: JSON.stringify(entry) });
export const updateChapterProgress = (entry) =>
  api('/auth/history/chapter', { method: 'PUT', body: JSON.stringify(entry) });

// Profile
export const updateProfile = (data) =>
  api('/users/profile', { method: 'PATCH', body: JSON.stringify(data) });
