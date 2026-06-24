import { useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Circle, Clock3, Crown, LockKeyhole, Map, Plus, Sparkles, X } from 'lucide-react';
import { formatDate } from '../lib/format';
import { getLanguageStats, masteryStages } from '../lib/progression';
import { useQuestStore } from '../store/useQuestStore';
import { LanguageSigil, Panel, ProgressBar, SectionHeader, StatusPill } from '../components/ui/Primitives';

export function Roadmaps() {
  const { data, setTopicStatus, addTopic } = useQuestStore();
  const [languageId, setLanguageId] = useState(data.languages[0].id);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const language = data.languages.find((item) => item.id === languageId)!;
  const topics = useMemo(() => data.topics.filter((topic) => topic.languageId === languageId && !topic.parentId).sort((a, b) => a.order - b.order), [data.topics, languageId]);
  const stats = getLanguageStats(language, data);
  const nextStage = stats.next;
  const submit = () => { if (!name.trim()) return; addTopic({ languageId, name: name.trim(), description: 'A new chapter in this realm.', status: 'not-started', estimatedHours: 8 }); setName(''); setShowAdd(false); };

  return <div className="page-stack roadmaps-page">
    <div className="realm-tabs">{data.languages.map((item) => { const itemStats = getLanguageStats(item, data); return <button key={item.id} onClick={() => setLanguageId(item.id)} className={languageId === item.id ? 'active' : ''} style={{ '--realm-color': item.color } as React.CSSProperties}><LanguageSigil language={item} size="sm" /><span><strong>{item.name}</strong><small>{itemStats.stage.name} · {itemStats.completed}/{itemStats.total} nodes</small></span></button>; })}<button className="new-realm"><Plus size={18} /><span>New realm</span></button></div>
    <section className="realm-banner" style={{ '--realm-color': language.color } as React.CSSProperties}>
      <div className="realm-banner-copy"><LanguageSigil language={language} size="lg" /><div><span>{stats.stage.name} realm</span><h2>{language.name} Mastery Path</h2><p>{language.description}</p></div></div>
      <div className="realm-banner-stats"><div><strong>{stats.completed}/{stats.total}</strong><span>nodes</span></div><div><strong>{Math.round(stats.hours)}h</strong><span>invested</span></div><div><strong>{stats.revisions}</strong><span>revisions</span></div><div className="realm-progress"><span>{nextStage.name}</span><strong>{stats.progress}%</strong><ProgressBar value={stats.progress} color={language.color} /></div></div>
    </section>
    <div className="roadmap-layout">
      <Panel className="skill-tree-panel">
        <SectionHeader title="The knowledge constellation" kicker="Permanent unlocks" action={<button className="primary small" onClick={() => setShowAdd(true)}><Plus size={15} />Add quest</button>} />
        <div className="skill-tree">{topics.map((topic, index) => {
          const children = data.topics.filter((child) => child.parentId === topic.id);
          return <div className={`tree-row ${topic.status}`} key={topic.id}>
            <div className="tree-axis"><i /><button className="tree-node" onClick={() => setTopicStatus(topic.id, topic.status === 'completed' ? 'in-progress' : topic.status === 'in-progress' ? 'completed' : 'in-progress')} style={{ '--node-color': language.color } as React.CSSProperties}>{topic.status === 'completed' ? <Check size={18} /> : topic.status === 'in-progress' ? <Sparkles size={17} /> : <LockKeyhole size={15} />}</button>{index < topics.length - 1 && <span />}</div>
            <div className="tree-card"><div className="tree-card-top"><div><small>Chapter {String(index + 1).padStart(2, '0')}</small><h3>{topic.name}</h3></div><StatusPill status={topic.status} /></div><p>{topic.description}</p><div className="tree-details"><span><Clock3 size={14} />{topic.actualHours}h / {topic.estimatedHours}h</span>{topic.deadline && <span>Portal closes {formatDate(topic.deadline)}</span>}<ProgressBar value={topic.estimatedHours ? topic.actualHours / topic.estimatedHours * 100 : 0} color={language.color} subtle /></div>
              {children.length > 0 && <div className="subtopic-list">{children.map((child) => <button key={child.id} onClick={() => setTopicStatus(child.id, child.status === 'completed' ? 'in-progress' : 'completed')}><span className={child.status}>{child.status === 'completed' ? <Check size={12} /> : <Circle size={9} />}</span>{child.name}<small>{child.actualHours}h</small></button>)}</div>}
            </div>
          </div>;
        })}</div>
      </Panel>
      <aside className="roadmap-aside">
        <Panel className="stage-panel"><SectionHeader title="Realm evolution" kicker="Mastery stages" action={<Crown size={18} />} /><div className="stage-list">{masteryStages.map((stage, index) => <div key={stage.name} className={index < stats.stageIndex ? 'passed' : index === stats.stageIndex ? 'current' : ''}><span>{index < stats.stageIndex ? <Check size={13} /> : index + 1}</span><div><strong>{stage.name}</strong><small>{index === stats.stageIndex ? 'You are here' : index < stats.stageIndex ? 'Awakened' : `${stage.topics} topics · ${stage.hours}h`}</small></div>{index === stats.stageIndex && <i />}</div>)}</div></Panel>
        <Panel className="next-gate"><Map size={20} /><span><small>Next transformation</small><strong>Become {nextStage.name}</strong></span><ul><li className={stats.completed >= nextStage.topics ? 'done' : ''}><Check size={12} />{nextStage.topics} topics completed</li><li className={stats.hours >= nextStage.hours ? 'done' : ''}><Check size={12} />{nextStage.hours} focused hours</li><li className={stats.revisions >= nextStage.revisions ? 'done' : ''}><Check size={12} />{nextStage.revisions} knowledge revisions</li></ul><button className="text-button">View all gates <ArrowRight size={14} /></button></Panel>
      </aside>
    </div>
    {showAdd && <div className="modal-backdrop" onMouseDown={() => setShowAdd(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowAdd(false)}><X size={18} /></button><SectionHeader title="Chart a new quest" kicker={`${language.name} realm`} /><label>Quest name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Async programming" onKeyDown={(event) => event.key === 'Enter' && submit()} /></label><label>Starting status<select><option>Uncharted</option><option>In progress</option></select></label><div className="modal-actions"><button className="secondary" onClick={() => setShowAdd(false)}>Cancel</button><button className="primary" onClick={submit}>Add to path <ChevronDown size={15} /></button></div></div></div>}
  </div>;
}
