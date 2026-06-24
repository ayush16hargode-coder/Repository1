import { ArrowRight, CalendarClock, Check, ChevronRight, Clock3, Crown, Map, Sparkles, TimerReset } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatDate, formatDuration } from '../lib/format';
import { getLanguageStats, getMomentum, minutesInRange } from '../lib/progression';
import { useQuestStore } from '../store/useQuestStore';
import { SessionDock } from '../components/SessionDock';
import { Eyebrow, LanguageSigil, Panel, ProgressBar, SectionHeader } from '../components/ui/Primitives';
import { MomentumCore } from '../components/ui/MomentumCore';

const sparkData = [1.2, 2.1, 1.6, 3.2, 2.5, 3.8, 3.3].map((hours, day) => ({ day, hours }));

export function Dashboard() {
  const { data, setPage } = useQuestStore();
  const focus = data.topics.filter((topic) => topic.status === 'in-progress' && !topic.parentId);
  const upcoming = data.topics.filter((topic) => topic.deadline && topic.status !== 'completed').sort((a, b) => a.deadline!.localeCompare(b.deadline!)).slice(0, 3);
  const completed = data.topics.filter((topic) => topic.completedAt).sort((a, b) => b.completedAt!.localeCompare(a.completedAt!)).slice(0, 3);
  const todayMinutes = data.sessions.filter((session) => session.date === '2026-06-24').reduce((sum, session) => sum + session.durationMinutes, 0);
  const week = minutesInRange(data.sessions, 7); const month = minutesInRange(data.sessions, 30);
  const primary = data.languages[0]; const mastery = getLanguageStats(primary, data);

  return (
    <div className="dashboard-grid">
      <main className="dashboard-main">
        <section className="hero-strip">
          <div><Eyebrow>Welcome back, adventurer</Eyebrow><h2>Your worlds are <span>growing.</span></h2><p>A calm, focused day is waiting. Python is closest to its next transformation.</p></div>
          <div className="hero-orbit"><i /><i /><span><Map size={28} /></span></div>
        </section>

        <section>
          <SectionHeader title="Current quests" kicker="In the field" action={<button className="text-button" onClick={() => setPage('roadmaps')}>All mastery paths <ArrowRight size={14} /></button>} />
          <div className="focus-grid">{focus.map((topic) => {
            const language = data.languages.find((item) => item.id === topic.languageId)!;
            const progress = Math.round((topic.actualHours / topic.estimatedHours) * 100);
            return <Panel className="focus-card" key={topic.id}>
              <div className="focus-top"><LanguageSigil language={language} /><div><span>{language.name} realm</span><h3>{topic.name}</h3></div><button className="round-arrow" onClick={() => setPage('roadmaps')}><ChevronRight size={17} /></button></div>
              <p>{topic.description}</p>
              <div className="focus-progress"><div><span>Quest progress</span><strong>{progress}%</strong></div><ProgressBar value={progress} color={language.color} /></div>
              <div className="focus-meta"><span><CalendarClock size={14} />{topic.deadline ? formatDate(topic.deadline, { day: 'numeric', month: 'long' }) : 'Open ended'}</span><span><Clock3 size={14} />{topic.actualHours}h of {topic.estimatedHours}h</span></div>
            </Panel>;
          })}</div>
        </section>

        <div className="dashboard-split">
          <Panel className="mastery-preview">
            <SectionHeader title={`${primary.name} Mastery Path`} kicker="Realm evolution" action={<LanguageSigil language={primary} size="sm" />} />
            <div className="stage-row"><span>{mastery.stage.name}</span><i><b style={{ width: `${mastery.progress}%` }} /></i><strong>{mastery.next.name}</strong></div>
            <div className="node-path">{data.topics.filter((topic) => topic.languageId === primary.id && !topic.parentId).slice(0, 6).map((topic, index) => <div key={topic.id} className={`path-node ${topic.status}`}><span>{topic.status === 'completed' ? <Check size={15} /> : index + 1}</span><small>{topic.name}</small></div>)}</div>
            <div className="mastery-footer"><span><Crown size={15} /> {mastery.completed} knowledge nodes awakened</span><button onClick={() => setPage('roadmaps')}>Enter realm <ArrowRight size={14} /></button></div>
          </Panel>
          <Panel className="week-card">
            <SectionHeader title="Focus rhythm" kicker="Last 7 days" action={<span className="trend-chip">+18%</span>} />
            <div className="chart-total"><strong>{formatDuration(week)}</strong><span>this week</span></div>
            <div className="mini-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={sparkData}><defs><linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#68e1f5" stopOpacity={.35} /><stop offset="100%" stopColor="#68e1f5" stopOpacity={0} /></linearGradient></defs><Tooltip contentStyle={{ background: '#121725', border: '1px solid #2a3247', borderRadius: 10 }} /><Area type="monotone" dataKey="hours" stroke="#68e1f5" strokeWidth={2.5} fill="url(#focusFill)" /></AreaChart></ResponsiveContainer></div>
          </Panel>
        </div>

        <div className="dashboard-split lower">
          <Panel>
            <SectionHeader title="Approaching portals" kicker="Deadlines" action={<button className="icon-button"><CalendarClock size={16} /></button>} />
            <div className="deadline-list">{upcoming.map((topic, index) => { const language = data.languages.find((item) => item.id === topic.languageId)!; return <div key={topic.id}><span className={`deadline-number ${index === 0 ? 'urgent' : ''}`}>{formatDate(topic.deadline!, { day: '2-digit' })}<small>{formatDate(topic.deadline!, { month: 'short' })}</small></span><div><strong>{topic.name}</strong><small>{language.name} realm</small></div><span className="days-left">{index === 0 ? '6 days' : index === 1 ? '8 days' : '18 days'}</span></div>; })}</div>
          </Panel>
          <Panel>
            <SectionHeader title="Recently awakened" kicker="Knowledge nodes" action={<button className="text-button" onClick={() => setPage('knowledge')}>Open vault</button>} />
            <div className="completed-list">{completed.map((topic) => { const language = data.languages.find((item) => item.id === topic.languageId)!; return <div key={topic.id}><span className="completed-check" style={{ color: language.color }}><Check size={14} /></span><div><strong>{topic.name}</strong><small>{language.name} · {formatDate(topic.completedAt!)}</small></div><Sparkles size={15} /></div>; })}</div>
          </Panel>
        </div>
      </main>

      <aside className="dashboard-rail">
        <Panel className="momentum-panel"><MomentumCore sessions={data.sessions} /><div className="momentum-grid"><div><strong>{getMomentum(data.sessions)}</strong><span>current</span></div><div><strong>24</strong><span>best</span></div><div><strong>92%</strong><span>rhythm</span></div></div></Panel>
        <SessionDock />
        <Panel className="today-panel">
          <SectionHeader title="Today’s imprint" kicker="Time invested" />
          <div className="today-main"><strong>{formatDuration(todayMinutes)}</strong><span>across {data.sessions.filter((s) => s.date === '2026-06-24').length} sessions</span></div>
          <div className="time-bars">{data.languages.map((language) => { const minutes = data.sessions.filter((s) => s.date === '2026-06-24' && s.languageId === language.id).reduce((sum, s) => sum + s.durationMinutes, 0); return <div key={language.id}><span>{language.name}<b>{formatDuration(minutes)}</b></span><ProgressBar value={todayMinutes ? minutes / todayMinutes * 100 : 0} color={language.color} subtle /></div>; })}</div>
          <div className="vault-link"><TimerReset size={16} /><span><small>This month</small><strong>{formatDuration(month)}</strong></span><button onClick={() => setPage('time')}><ArrowRight size={15} /></button></div>
        </Panel>
        <Panel className="achievement-tease"><span><Sparkles size={17} /></span><div><small>New legacy</small><strong>Unbroken Current</strong><p>14 days of Momentum</p></div></Panel>
      </aside>
    </div>
  );
}
