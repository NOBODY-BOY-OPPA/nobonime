import { NavLink } from 'react-router-dom';
import { Compass, Home, Library, BookOpen, Settings } from 'lucide-react';
export default function Sidebar() { return <aside className="sidebar"><div className="brand"><span>NO</span>BONIME</div><nav><NavLink to="/"><Home size={18}/> Home</NavLink><NavLink to="/discover"><Compass size={18}/> Discover</NavLink><NavLink to="/library"><Library size={18}/> Library</NavLink><NavLink to="/manga/one-piece/1"><BookOpen size={18}/> Manga reader</NavLink></nav><NavLink className="settings" to="/settings"><Settings size={18}/> Settings</NavLink></aside>; }
