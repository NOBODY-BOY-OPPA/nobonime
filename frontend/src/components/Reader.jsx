import { useEffect, useState } from 'react';
import { chapter } from '../api';
import useImagePreloader from '../hooks/useImagePreloader';

export default function Reader({ mangaId, chapterId }) {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setError('');
    setPages([]);
    
    chapter(mangaId, chapterId)
      .then((data) => {
        if (active) setPages(data.pages || []);
      })
      .catch((e) => {
        if (active) setError(e.message || 'Failed to load chapter');
      });

    return () => { active = false; };
  }, [mangaId, chapterId]);

  const preloaded = useImagePreloader(pages.slice(0, 3));

  return (
    <main className="reader flex flex-col items-center w-full bg-gray-900 min-h-screen">
      <div className="w-full max-w-3xl flex flex-col bg-black shadow-2xl">
        {error && (
          <p className="notice error text-red-500 text-center font-bold p-4">
            {error}
          </p>
        )}
        
        {pages.length > 0 && !preloaded.complete && (
          <p className="notice text-white text-center p-4">
            Loading pages...
          </p>
        )}
        
        {pages.map((src, i) => (
          <img 
            key={`${src}-${i}`} 
            src={src} 
            alt={`Page ${i + 1}`} 
            loading={i < 3 ? 'eager' : 'lazy'} 
            onError={(e) => { e.target.style.display = 'none'; }}
            className="w-full h-auto block m-0 p-0" 
          />
        ))}
      </div>
    </main>
  );
}
