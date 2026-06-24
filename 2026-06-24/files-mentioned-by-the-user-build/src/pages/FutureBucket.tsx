import { useState } from 'react';
import { BookMarked, CalendarDays, Code2, GripVertical, Languages, Mountain, Plus, Rocket, Trash2, X } from 'lucide-react';
import { formatMonth } from '../lib/format';
import { useQuestStore } from '../store/useQuestStore';
import type { FutureGoal } from '../types';
import { Panel, SectionHeader } from '../components/ui/Primitives';

const categoryIcons = { Languages, Skills: BookMarked, Projects: Rocket, Challenges: Mountain };
const categoryColors = { Languages: '#68e1f5', Skills: '#b197fc', Projects: '#63e6be', Challenges: '#ffd166' };

export function FutureBucket() {
  const { data, addFutureGoal, reorderFutureGoal, removeFutureGoal } = useQuestStore();
  const [dragged, setDragged] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState(''); const [category, setCategory] = useState<FutureGoal['category']>('Projects'); const [target, setTarget] = useState('2026-09-01');
  const add = () => { if (!title.trim()) return; addFutureGoal({ title: title.trim(), category, targetStart: target, description: 'A new possibility beyond the current horizon.' }); setTitle(''); setShowAdd(false); };

  return <div className="page-stack future-page">
    <section className="future-hero"><div><span>Beyond the current map</span><h2>Your horizon is allowed to be <em>vast.</em></h2><p>Collect future languages, ambitious builds, and wild challenges here. They can wait without becoming noise.</p><button className="primary" onClick={() => setShowAdd(true)}><Plus size={16} />Add to the horizon</button></div><div className="horizon-graphic"><i className="orbit-a" /><i className="orbit-b" /><span><Rocket size={32} /></span><b>4</b><small>possibilities</small></div></section>
    <div className="future-layout">
      <main><SectionHeader title="Priority orbit" kicker="Drag to reorder" action={<span className="drag-hint"><GripVertical size={14} />Highest intention first</span>} /><div className="future-list">{data.futureGoals.map((goal, index) => { const Icon = categoryIcons[goal.category]; const color = categoryColors[goal.category]; return <Panel key={goal.id} className={`future-card ${dragged === goal.id ? 'dragging' : ''}`}><button className="drag-handle" draggable onDragStart={() => setDragged(goal.id)} onDragEnd={() => setDragged(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragged) reorderFutureGoal(dragged, goal.id); }}><GripVertical size={19} /></button><span className="priority-number">{String(index + 1).padStart(2, '0')}</span><div className="future-icon" style={{ '--future-color': color } as React.CSSProperties}><Icon size={20} /></div><div className="future-copy"><span>{goal.category}</span><h3>{goal.title}</h3><p>{goal.description}</p></div><div className="future-date"><CalendarDays size={15} /><span><small>Target start</small><strong>{formatMonth(goal.targetStart)}</strong></span></div><button className="remove-goal" onClick={() => removeFutureGoal(goal.id)} aria-label={`Remove ${goal.title}`}><Trash2 size={15} /></button></Panel>; })}</div></main>
      <aside><Panel className="horizon-map"><SectionHeader title="Horizon map" kicker="By category" /><div className="category-orbits">{Object.entries(categoryIcons).map(([key, Icon], index) => { const count = data.futureGoals.filter((goal) => goal.category === key).length; return <div key={key} style={{ '--future-color': categoryColors[key as FutureGoal['category']] } as React.CSSProperties}><span><Icon size={17} /></span><div><strong>{key}</strong><small>{count} waiting</small></div><b>{index + 1}</b></div>; })}</div></Panel><Panel className="future-note"><Code2 size={18} /><h3>A quiet promise</h3><p>The Future Bucket has no overdue states. When a target passes, the idea simply waits for you—no guilt attached.</p></Panel></aside>
    </div>
    {showAdd && <div className="modal-backdrop" onMouseDown={() => setShowAdd(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowAdd(false)}><X size={18} /></button><SectionHeader title="Place a star on the horizon" kicker="Future possibility" /><label>Name<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What do you want to explore?" /></label><div className="two-fields"><label>Category<select value={category} onChange={(event) => setCategory(event.target.value as FutureGoal['category'])}>{Object.keys(categoryIcons).map((item) => <option key={item}>{item}</option>)}</select></label><label>Target start<input type="date" value={target} onChange={(event) => setTarget(event.target.value)} /></label></div><div className="modal-actions"><button className="secondary" onClick={() => setShowAdd(false)}>Not now</button><button className="primary" onClick={add}>Add possibility</button></div></div></div>}
  </div>;
}
