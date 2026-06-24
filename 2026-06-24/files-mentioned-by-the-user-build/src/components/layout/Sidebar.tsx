import { BarChart3, BookOpen, Clock3, Compass, Database, Gem, LayoutDashboard, Map, Settings2, Sparkles } from 'lucide-react';
import type { PageId } from '../../types';

const navigation: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Command Deck', icon: LayoutDashboard },
  { id: 'journey', label: 'Journey Log', icon: Compass },
  { id: 'roadmaps', label: 'Mastery Paths', icon: Map },
  { id: 'time', label: 'Time Vault', icon: Clock3 },
  { id: 'analytics', label: 'Observatory', icon: BarChart3 },
  { id: 'future', label: 'Future Realms', icon: Sparkles },
  { id: 'knowledge', label: 'Knowledge Vault', icon: BookOpen },
];

export function Sidebar({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onNavigate('dashboard')} aria-label="CodeQuest home">
        <span className="brand-mark"><Gem size={20} /></span><span><strong>CODEQUEST</strong><small>Journey OS</small></span>
      </button>
      <div className="sidebar-label">Your world</div>
      <nav>{navigation.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className={page === item.id ? 'active' : ''}><item.icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{page === item.id && <i />}</button>)}</nav>
      <div className="sidebar-spacer" />
      <button className={`settings-link ${page === 'settings' ? 'active' : ''}`} onClick={() => onNavigate('settings')}><Settings2 size={17} /><span>Settings</span></button>
      <div className="local-badge"><Database size={14} /><span><strong>Local realm</strong><small>SQLite · secured on device</small></span></div>
    </aside>
  );
}
