import { Activity, ArrowUpRight, CheckCircle2, Gauge, Orbit, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDuration } from '../lib/format';
import { getMomentum } from '../lib/progression';
import { useQuestStore } from '../store/useQuestStore';
import { Panel, ProgressBar, SectionHeader } from '../components/ui/Primitives';

const velocity = [
  { month: 'Jan', topics: 2, hours: 20 }, { month: 'Feb', topics: 3, hours: 28 }, { month: 'Mar', topics: 3, hours: 34 },
  { month: 'Apr', topics: 5, hours: 48 }, { month: 'May', topics: 6, hours: 57 }, { month: 'Jun', topics: 7, hours: 66 },
];

export function Analytics() {
  const { data } = useQuestStore();
  const completed = data.topics.filter((topic) => topic.status === 'completed' && !topic.parentId).length;
  const total = data.topics.filter((topic) => !topic.parentId).length;
  const deadlines = data.topics.filter((topic) => topic.deadline); const onTime = deadlines.filter((topic) => topic.status === 'completed' || topic.deadline! >= '2026-06-24').length;
  const totalMinutes = data.sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const heatDays = Array.from({ length: 91 }, (_, index) => {
    const date = new Date(2026, 2, 26 + index).toISOString().slice(0, 10);
    const minutes = data.sessions.filter((session) => session.date === date).reduce((sum, session) => sum + session.durationMinutes, 0);
    return { date, minutes, level: minutes === 0 ? 0 : minutes < 60 ? 1 : minutes < 100 ? 2 : minutes < 150 ? 3 : 4 };
  });

  return <div className="page-stack analytics-page">
    <div className="insight-stat-grid">
      <Panel><span><TrendingUp size={18} /></span><div><small>Learning velocity</small><strong>7 topics</strong><em><ArrowUpRight size={12} /> +16% this month</em></div></Panel>
      <Panel><span><Gauge size={18} /></span><div><small>Weekly average</small><strong>{formatDuration(Math.round(totalMinutes / 10))}</strong><em><ArrowUpRight size={12} /> +2h 12m</em></div></Panel>
      <Panel><span><CheckCircle2 size={18} /></span><div><small>Completion rate</small><strong>{Math.round(completed / total * 100)}%</strong><em>{completed} nodes awakened</em></div></Panel>
      <Panel><span><Activity size={18} /></span><div><small>Consistency</small><strong>{getMomentum(data.sessions)} days</strong><em>Momentum is strong</em></div></Panel>
    </div>
    <div className="analytics-main-grid">
      <Panel className="velocity-chart"><SectionHeader title="Learning velocity" kicker="Topics completed per month" action={<div className="metric-key"><i /> Completed topics</div>} /><div className="chart-large"><ResponsiveContainer><AreaChart data={velocity} margin={{ top: 12, right: 12, left: -25, bottom: 0 }}><defs><linearGradient id="velocityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b7cf6" stopOpacity=".5" /><stop offset="1" stopColor="#8b7cf6" stopOpacity="0" /></linearGradient></defs><CartesianGrid vertical={false} stroke="#22283a" strokeDasharray="3 5" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#788199', fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#687087', fontSize: 10 }} /><Tooltip contentStyle={{ background: '#111625', border: '1px solid #2c354c', borderRadius: 10 }} /><Area type="monotone" dataKey="topics" stroke="#9e91ff" strokeWidth={3} fill="url(#velocityFill)" dot={{ r: 4, fill: '#0b0d16', stroke: '#a69aff', strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div></Panel>
      <Panel className="completion-orbit"><SectionHeader title="Path completion" kicker="Across all realms" /><div className="radial-progress" style={{ '--progress': `${Math.round(completed / total * 360)}deg` } as React.CSSProperties}><div><strong>{Math.round(completed / total * 100)}%</strong><span>mastered</span></div></div><div className="completion-rows">{data.languages.map((language) => { const realmTopics = data.topics.filter((topic) => topic.languageId === language.id && !topic.parentId); const done = realmTopics.filter((topic) => topic.status === 'completed').length; return <div key={language.id}><span>{language.name}<b>{done}/{realmTopics.length}</b></span><ProgressBar value={done / realmTopics.length * 100} color={language.color} subtle /></div>; })}</div></Panel>
    </div>
    <Panel className="heatmap-panel"><SectionHeader title="Consistency field" kicker="Last 13 weeks" action={<span className="heat-legend">Quiet <i className="l1" /><i className="l2" /><i className="l3" /><i className="l4" /> Deep</span>} /><div className="heat-layout"><div className="heat-labels"><span>Mon</span><span>Wed</span><span>Fri</span></div><div className="heatmap">{heatDays.map((day) => <i key={day.date} className={`level-${day.level}`} title={`${day.date}: ${day.minutes} minutes`} />)}</div></div><div className="heat-foot"><span><Orbit size={15} /> You returned on <strong>78% of days</strong> this quarter.</span><span>Your longest current current: <strong>{getMomentum(data.sessions)} days</strong></span></div></Panel>
    <div className="analytics-bottom-grid">
      <Panel><SectionHeader title="Deadline alignment" kicker="Are you following the map?" /><div className="deadline-orbit"><div><strong>{Math.round(onTime / deadlines.length * 100)}%</strong><span>on course</span></div><ul><li><i className="good" />On or ahead of schedule <strong>{onTime}</strong></li><li><i className="warn" />Needs attention <strong>{deadlines.length - onTime}</strong></li><li><i />Completed before deadline <strong>4</strong></li></ul></div></Panel>
      <Panel><SectionHeader title="Focus & completion" kicker="Monthly correlation" /><div className="small-line-chart"><ResponsiveContainer><LineChart data={velocity}><XAxis dataKey="month" hide /><YAxis hide /><Tooltip contentStyle={{ background: '#111625', border: '1px solid #2c354c', borderRadius: 10 }} /><Line type="monotone" dataKey="hours" stroke="#62e0f3" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="topics" stroke="#9b8efa" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div><p className="correlation-copy">Your completion rate rises when you invest at least <strong>14 hours per week.</strong></p></Panel>
    </div>
  </div>;
}
