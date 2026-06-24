import { BarChart3, Compass, LayoutDashboard, Map, Menu } from 'lucide-react';
import type { PageId } from '../../types';

export function MobileNav({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }) {
  const items: { id: PageId; label: string; icon: typeof Compass }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard }, { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'roadmaps', label: 'Paths', icon: Map }, { id: 'analytics', label: 'Insight', icon: BarChart3 }, { id: 'settings', label: 'More', icon: Menu },
  ];
  return <nav className="mobile-nav">{items.map((item) => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)}><item.icon size={20} /><span>{item.label}</span></button>)}</nav>;
}
