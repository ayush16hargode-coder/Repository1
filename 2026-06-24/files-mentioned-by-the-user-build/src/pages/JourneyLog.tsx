import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { formatDate, formatDuration } from '../lib/format';
import { useQuestStore } from '../store/useQuestStore';
import { LanguageSigil, Panel, SectionHeader } from '../components/ui/Primitives';
import { SessionDock } from '../components/SessionDock';

export function JourneyLog() {
  const { data } = useQuestStore();
  const [query, setQuery] = useState('');
  const [languageId, setLanguageId] = useState('all');
  const filtered = useMemo(() => data.sessions.filter((session) => {
    const language = data.languages.find((item) => item.id === session.languageId);
    const topic = data.topics.find((item) => item.id === session.topicId);
    return (languageId === 'all' || session.languageId === languageId) && `${language?.name} ${topic?.name} ${session.notes}`.toLowerCase().includes(query.toLowerCase());
  }), [data, query, languageId]);
  const grouped = filtered.reduce<Record<string, typeof filtered>>((groups, session) => { (groups[session.date] ??= []).push(session); return groups; }, {});

  return <div className="page-stack journey-page">
    <Panel className="journey-tools">
      <div className="field search-field"><Search size={16} /><input aria-label="Search journey" placeholder="Search topics, notes, completed work…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <div className="field select-field"><Filter size={15} /><select aria-label="Filter language" value={languageId} onChange={(event) => setLanguageId(event.target.value)}><option value="all">All realms</option>{data.languages.map((language) => <option key={language.id} value={language.id}>{language.name}</option>)}</select></div>
      <button className="secondary"><CalendarDays size={15} />All time</button><button className="icon-button"><SlidersHorizontal size={16} /></button>
      <span className="result-count">{filtered.length} entries found</span>
    </Panel>
    <div className="journey-layout">
      <main className="timeline-panel">
        {Object.entries(grouped).map(([date, sessions]) => <section className="timeline-day" key={date}>
          <div className="timeline-date"><span>{formatDate(date, { day: '2-digit' })}</span><div><strong>{formatDate(date, { weekday: 'long' })}</strong><small>{formatDate(date, { month: 'long', year: 'numeric' })}</small></div><i /></div>
          <div className="timeline-entries">{sessions.map((session) => { const language = data.languages.find((item) => item.id === session.languageId)!; const topic = data.topics.find((item) => item.id === session.topicId); return <Panel className="timeline-entry" key={session.id}>
            <div className="timeline-entry-head"><LanguageSigil language={language} size="sm" /><div><small>{language.name} realm</small><h3>{topic?.name ?? 'Unknown quest'}</h3></div><span className="duration-chip"><Clock3 size={13} />{formatDuration(session.durationMinutes)}</span></div>
            {session.completedItems?.length ? <div className="completed-items"><span>Completed</span>{session.completedItems.map((item) => <b key={item}><CheckCircle2 size={13} />{item}</b>)}</div> : null}
            <p>{session.notes}</p><div className="entry-time">{session.startTime} — {session.endTime}<span>Focused session</span></div>
          </Panel>; })}</div>
        </section>)}
      </main>
      <aside className="journey-aside"><SessionDock full /><Panel className="log-summary"><SectionHeader title="Trail summary" kicker="Visible entries" /><div><span><strong>{formatDuration(filtered.reduce((sum, item) => sum + item.durationMinutes, 0))}</strong><small>focus time</small></span><span><strong>{new Set(filtered.map((item) => item.date)).size}</strong><small>active days</small></span></div><p>Your most revisited quest is <strong>Object Craft</strong>.</p></Panel></aside>
    </div>
  </div>;
}
