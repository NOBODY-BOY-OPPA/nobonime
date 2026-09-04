import { useParams } from 'react-router-dom';
import CustomHlsPlayer from '../components/player/CustomHlsPlayer.jsx';
export default function StreamAnime() { const { id } = useParams(); return <><h1 className="page-title">Now playing</h1><CustomHlsPlayer id={id} /></>; }
