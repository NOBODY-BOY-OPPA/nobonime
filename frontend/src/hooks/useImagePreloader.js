import { useEffect, useState } from 'react';

export default function useImagePreloader(urls = []) {
  const [ready, setReady] = useState(0);
  
  
  const urlsKey = JSON.stringify(urls);

  useEffect(() => {
    let active = true;
    if (urls.length === 0) return;

    Promise.all(
      urls.map((url) =>
        new Promise((resolve) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = resolve; 
          image.src = url;
        })
      )
    ).then(() => {
      if (active) setReady(urls.length);
    });

    return () => {
      active = false;
    };
  }, [urlsKey]);

  return { ready, total: urls.length, complete: ready === urls.length && urls.length > 0 };
}
