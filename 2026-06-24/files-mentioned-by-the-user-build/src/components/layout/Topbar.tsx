import { CalendarDays, ChevronDown, Command, Search } from 'lucide-react';
import type { PageId } from '../../types';

const titles: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Command Deck', subtitle: 'Wednesday, 24 June' },
  journey: { title: 'Journey Log', subtitle: 'Every hour leaves a trail' },
  roadmaps: { title: 'Mastery Paths', subtitle: 'Grow one realm at a time' },
  time: { title: 'Time Vault', subtitle: 'Where your focus has gone' },
  analytics: { title: 'Observatory', subtitle: 'Patterns in your journey' },
  future: { title: 'Future Realms', subtitle: 'Ideas waiting beyond the horizon' },
  knowledge: { title: 'Knowledge Vault', subtitle: 'What you have made your own' },
  settings: { title: 'Realm Settings', subtitle: 'Local, private, and yours' },
};

export function Topbar({ page }: { page: PageId }) {
  return (
    <header className="topbar">
      <div><h1>{titles[page].title}</h1><p>{titles[page].subtitle}</p></div>
      <div className="top-actions">
        <button className="search-trigger"><Search size={16} /><span>Search your journey</span><kbd><Command size={11} />K</kbd></button>
        <button className="date-chip"><CalendarDays size={16} /><span>Jun 24</span><ChevronDown size={14} /></button>
        <div className="avatar">AK<span /></div>
      </div>
    </header>
  );
}
