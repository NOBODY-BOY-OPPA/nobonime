import { useParams } from 'react-router-dom';
import VerticalWebtoonReader from '../components/reader/VerticalWebtoonReader.jsx';
export default function ReadManga() { const { mangaId, chapterId } = useParams(); return <><h1 className="page-title">Reader · Chapter {chapterId}</h1><VerticalWebtoonReader mangaId={mangaId} chapterId={chapterId} /></>; }
