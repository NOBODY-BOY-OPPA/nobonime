import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { stream } from '../api';

export default function VideoPlayer({ id }) {
  const video = useRef(null);
  const [status, setStatus] = useState('Loading stream...');
  const [skips, setSkips] = useState([]);

  useEffect(() => {
    let hls;
    let active = true;

    // 1. Initialisation du flux vidéo
    stream(id).then(({ url }) => {
      if (!active || !video.current) return;
      
      if (video.current.canPlayType('application/vnd.apple.mpegurl')) {
        video.current.src = url;
      } else if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video.current);
      } else {
        throw new Error('This browser does not support HLS playback');
      }
      setStatus('');
    }).catch((e) => {
      if (active) setStatus(e.message || 'Error loading video stream');
    });

    // 2. Récupération des données AniSkip (Non bloquant)
    const fetchSkips = async () => {
      try {
        const res = await fetch(`https://api.aniskip.com/v2/skip-times/${encodeURIComponent(id)}/1`);
        if (!res.ok) return;
        const data = await res.json();
        const validSkips = (data?.results || []).filter(
          (item) => item.skipType === 'op' || item.skipType === 'ed'
        );
        if (active) setSkips(validSkips);
      } catch (err) {
        console.warn('AniSkip metadata unavailable.'); // Ignore l'erreur silencieusement
      }
    };
    
    fetchSkips();

    return () => {
      active = false;
      hls?.destroy();
    };
  }, [id]);

  const skip = (item) => {
    if (video.current) {
      video.current.currentTime = item.interval?.endTime || item.endTime || 0;
    }
  };

  return (
    <div className="player">
      <video ref={video} controls playsInline />
      {status && <div className="player-status">{status}</div>}
      
      {skips.length > 0 && (
        <div className="skip-actions">
          {skips.map((item) => (
            <button 
              className="button" 
              type="button" 
              key={`${item.skipType}-${item.interval?.startTime || item.endTime}`} 
              onClick={() => skip(item)}
            >
              Skip {item.skipType.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <small>HLS adaptive playback · AniSkip metadata</small>
    </div>
  );
}
