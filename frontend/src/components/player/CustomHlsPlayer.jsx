import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AniSkipOverlay from './AniSkipOverlay.jsx';

export default function CustomHlsPlayer({ animeId, episodeId, src, videoRef }) {
  const navigate = useNavigate();

  const handleMangaTransition = async () => {
    try {
      const { data } = await axios.get(`/api/videos/${animeId}/manga`);
      if (data?.mangaId) {
        navigate(`/read/${data.mangaId}`);
      }
    } catch (error) {
      console.error('Aucune adaptation manga/webtoon trouvée.', error);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        controls
        className="w-full h-full"
        onEnded={handleMangaTransition}
      />
      
      <AniSkipOverlay episodeId={episodeId} videoRef={videoRef} />

      <button
        onClick={handleMangaTransition}
        className="absolute top-4 right-4 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg z-10"
      >
        Lire la suite en Manga
      </button>
    </div>
  );
}
