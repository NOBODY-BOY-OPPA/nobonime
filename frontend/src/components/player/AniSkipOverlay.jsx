import { useState, useEffect } from 'react';

export default function AniSkipOverlay({ skips = [], videoRef }) {
  const [activeSkip, setActiveSkip] = useState(null);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video || !skips.length) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const currentSkip = skips.find(
        (skip) =>
          skip.interval &&
          currentTime >= skip.interval.startTime &&
          currentTime <= skip.interval.endTime
      );

      setActiveSkip(currentSkip || null);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [skips, videoRef]);

  const handleSkipClick = (endTime) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = endTime;
      setActiveSkip(null);
    }
  };

  if (!activeSkip) return null;

  return (
    <div className="absolute bottom-16 left-6 z-20">
      <button
        onClick={() => handleSkipClick(activeSkip.interval.endTime)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all border border-blue-400"
      >
        Passer {activeSkip.skipType === 'op' ? "l'opening" : activeSkip.skipType === 'ed' ? "l'ending" : activeSkip.skipType.toUpperCase()}
      </button>
    </div>
  );
}
