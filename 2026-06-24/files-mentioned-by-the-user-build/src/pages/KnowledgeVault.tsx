import { useMemo, useState } from 'react';
import { BookOpen, Check, Clock3, Crown, ExternalLink, Gem, History, Search, Sparkles, X } from 'lucide-react';
import { daysBetween, formatDate, todayIso } from '../lib/format';
import { useQuestStore } from '../store/useQuestStore';
import { LanguageSigil, Panel, SectionHeader } from '../components/ui/Primitives';

const achievementIcons = { spark: Sparkles, gem: Gem, book: BookOpen, wave: History, crown: Crown, star: Sparkles };

export function KnowledgeVault() {
  const { data, addRevision } = useQuestStore();
  const [query, setQuery] = useState(''); const [languageId, setLanguageId] = useState('all'); const [revisionTopic, setRevisionTopic] = useState<string | null>(null); const [notes, setNotes] = useState('');
  const completed = useMemo(() => data.topics.filter((topic) => topic.status === 'completed' && (languageId === 'all' || topic.languageId === languageId) && `${topic.name} ${topic.summary}`.toLowerCase().includes(query.toLowerCase())), [data.topics, query, languageId]);
  const logRevision = () => { if (!revisionTopic) return; addRevision(revisionTopic, notes || 'Reviewed key ideas and examples.'); setRevisionTopic(null); setNotes(''); };

  return <div className="page-stack knowledge-page">
    <section className="vault-banner"><div><span><Gem size={15} />Knowledge made permanent</span><h2>{completed.length} awakened nodes</h2><p>Revisit what you know. Every revision makes the constellation brighter.</p></div><div className="vault-stats"><span><strong>{data.revisions.length}</strong><small>revisions</small></span><span><strong>3</strong><small>due soon</small></span><span><strong>86%</strong><small>freshness</small></span></div></section>
    <Panel className="vault-tools"><div className="field search-field"><Search size={16} /><input aria-label="Search vault" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your knowledge…" /></div><select aria-label="Filter vault realm" value={languageId} onChange={(event) => setLanguageId(event.target.value)}><option value="all">All realms</option>{data.languages.map((language) => <option value={language.id} key={language.id}>{language.name}</option>)}</select><span>{completed.length} knowledge nodes</span></Panel>
    <div className="knowledge-grid">{completed.map((topic) => { const language = data.languages.find((item) => item.id === topic.languageId)!; const revisions = data.revisions.filter((revision) => revision.topicId === topic.id).sort((a, b) => b.date.localeCompare(a.date)); const last = revisions[0]?.date ?? topic.completedAt!; return <Panel className="knowledge-card" key={topic.id}>
      <div className="knowledge-head"><LanguageSigil language={language} /><div><span>{language.name} realm</span><h3>{topic.name}</h3></div><Check size={16} /></div>
      <p>{topic.summary || topic.description}</p>
      <div className="resource-list"><small>Resources used</small>{topic.resources?.map((resource) => <button key={resource}><ExternalLink size={12} />{resource}</button>) ?? <span>No resources recorded</span>}</div>
      <div className="revision-state"><div><History size={15} /><span><small>Last revision</small><strong>{formatDate(last)} · {daysBetween(last, todayIso())} days ago</strong></span></div><span className={daysBetween(last, todayIso()) > 25 ? 'due' : ''}>{daysBetween(last, todayIso()) > 25 ? 'Due soon' : 'Knowledge fresh'}</span></div>
      <div className="revision-dots">{[0, 1, 2, 3].map((index) => <i key={index} className={revisions[index] ? 'complete' : index === revisions.length ? 'next' : ''}>{revisions[index] ? <Check size={10} /> : index + 1}</i>)}<span>{revisions.length} revisions</span></div>
      <button className="secondary full-button" onClick={() => setRevisionTopic(topic.id)}><Clock3 size={15} />Record a revision</button>
    </Panel>; })}</div>
    <section className="achievements-section"><SectionHeader title="Legacy gallery" kicker="Meaningful milestones" /><div className="achievement-grid">{data.achievements.map((achievement) => { const Icon = achievementIcons[achievement.icon as keyof typeof achievementIcons] ?? Sparkles; return <Panel key={achievement.id} className={`achievement-card ${achievement.unlockedAt ? 'unlocked' : 'locked'}`}><span><Icon size={20} /></span><div><h3>{achievement.title}</h3><p>{achievement.description}</p>{achievement.unlockedAt && <small>Unlocked {formatDate(achievement.unlockedAt)}</small>}</div>{achievement.unlockedAt && <Check size={13} />}</Panel>; })}</div></section>
    {revisionTopic && <div className="modal-backdrop" onMouseDown={() => setRevisionTopic(null)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setRevisionTopic(null)}><X size={18} /></button><SectionHeader title="Strengthen this node" kicker={data.topics.find((topic) => topic.id === revisionTopic)?.name} /><label>What did you revisit?<textarea autoFocus value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Capture what feels clearer now…" /></label><div className="modal-actions"><button className="secondary" onClick={() => setRevisionTopic(null)}>Cancel</button><button className="primary" onClick={logRevision}>Record revision</button></div></div></div>}
  </div>;
}
