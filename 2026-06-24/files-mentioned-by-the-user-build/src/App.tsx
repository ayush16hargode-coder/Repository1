import { useEffect } from 'react';
import { Analytics } from './pages/Analytics';
import { Dashboard } from './pages/Dashboard';
import { FutureBucket } from './pages/FutureBucket';
import { JourneyLog } from './pages/JourneyLog';
import { KnowledgeVault } from './pages/KnowledgeVault';
import { Roadmaps } from './pages/Roadmaps';
import { Settings } from './pages/Settings';
import { TimeVault } from './pages/TimeVault';
import { MobileNav } from './components/layout/MobileNav';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { useQuestStore } from './store/useQuestStore';
import type { PageId } from './types';

const pages: Record<PageId, () => JSX.Element> = {
  dashboard: Dashboard, journey: JourneyLog, roadmaps: Roadmaps, time: TimeVault,
  analytics: Analytics, future: FutureBucket, knowledge: KnowledgeVault, settings: Settings,
};

export default function App() {
  const { page, setPage, data, hydrate, hydrated } = useQuestStore();
  useEffect(() => { void hydrate(); }, [hydrate]);
  useEffect(() => {
    document.documentElement.dataset.accent = data.preferences.accent;
    document.documentElement.dataset.motion = data.preferences.compactMotion ? 'reduced' : 'full';
  }, [data.preferences]);
  const Page = pages[page];
  return (
    <div className={`app-shell ${hydrated ? 'ready' : ''}`}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <Sidebar page={page} onNavigate={setPage} />
      <div className="app-content"><Topbar page={page} /><div className="page-content"><Page /></div></div>
      <MobileNav page={page} onNavigate={setPage} />
    </div>
  );
}
