import { useState } from 'react';
import { api } from '../api';

export default function AdminDashboard() {
  const [form, setForm] = useState({ title: '', link: '', imageUrl: '' });
  const [result, setResult] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    const message = `${form.title}\n${form.link}`;
    try {
      const response = await api('/promo/whatsapp', { method: 'POST', body: JSON.stringify({ message, imageUrl: form.imageUrl || undefined }) });
      setResult(response.mode === 'preview' ? 'Preview generated. Configure WhatsApp credentials to send it.' : 'Message sent.');
    } catch (error) { setResult(error.message); }
  };
  return <section className="hero compact"><p className="eyebrow">NOBONIME ADMIN</p><h1>Promotion</h1><p>Create a WhatsApp promotion from a title, link and optional cover image.</p><form className="admin-form" onSubmit={submit}><input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/><input required type="url" placeholder="https://..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}/><input type="url" placeholder="Cover image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}/><button className="button" type="submit">Generate WhatsApp message</button></form>{result && <p className="notice">{result}</p>}</section>;
}
