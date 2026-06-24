import { ArrowDownRight, ArrowUpRight, Clock3, Compass, Crown, TimerReset } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDuration } from '../lib/format';
import { minutesInRange } from '../lib/progression';
import { useQuestStore } from '../store/useQuestStore';
import { LanguageSigil, Panel, ProgressBar, SectionHeader } from '../components/ui/Primitives';

const dayNames = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];

export function TimeVault() {
  const { data } = useQuestStore();
  const today = data.sessions.filter((session) => session.date === '2026-06-24').reduce((sum, session) => sum + session.durationMinutes, 0);
  const week = minutesInRange(data.sessions, 7); const month = minutesInRange(data.sessions, 30); const lifetime = data.sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2026, 5, 18 + index).toISOString().slice(0, 10);
    return { day: dayNames[index], hours: +(data.sessions.filter((session) => session.date === date).reduce((sum, session) => sum + session.durationMinutes, 0) / 60).toFixed(1) };
  });
  const realmData = data.languages.map((language) => ({ ...language, minutes: data.sessions.filter((session) => session.languageId === language.id).reduce((sum, session) => sum + session.durationMinutes, 0) }));
  const topicData = data.topics.map((topic) => ({ topic, minutes: data.sessions.filter((session) => session.topicId === topic.id).reduce((sum, session) => sum + session.durationMinutes, 0) })).filter((item) => item.minutes).sort((a, b) => b.minutes - a.minutes).slice(0, 5);

  return <div className="page-stack time-page">
    <div className="time-stat-grid">
      {[{ label: 'Today', value: today, change: '+42m', icon: Clock3 }, { label: 'This week', value: week, change: '+18%', icon: Compass }, { label: 'This month', value: month, change: '+12%', icon: TimerReset }, { label: 'Lifetime', value: lifetime, change: 'All realms', icon: Crown }].map((stat, index) => <Panel className="time-stat" key={stat.label}><span className="stat-icon"><stat.icon size={18} /></span><div><small>{stat.label}</small><strong>{formatDuration(stat.value)}</strong></div><span className={index === 0 ? 'neutral-change' : 'positive-change'}>{index > 0 && index < 3 ? <ArrowUpRight size={13} /> : null}{stat.change}</span></Panel>)}
    </div>
    <div className="time-main-grid">
      <Panel className="hours-chart"><SectionHeader title="Hours in the field" kicker="Seven-day rhythm" action={<div className="segmented"><button className="active">Week</button><button>Month</button><button>Year</button></div>} /><div className="chart-large"><ResponsiveContainer width="100%" height="100%"><BarChart data={daily} margin={{ top: 18, right: 0, bottom: 0, left: -20 }}><defs><linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#65e3f5" /><stop offset="1" stopColor="#7168e8" /></linearGradient></defs><CartesianGrid vertical={false} stroke="#222839" strokeDasharray="3 5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#788199', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#687087', fontSize: 10 }} /><Tooltip cursor={{ fill: 'rgba(95,225,245,.05)' }} contentStyle={{ background: '#111625', border: '1px solid #2c354c', borderRadius: 10 }} formatter={(value) => [`${value}h`, 'Focus']} /><Bar dataKey="hours" fill="url(#barFill)" radius={[7, 7, 2, 2]} maxBarSize={44} /></BarChart></ResponsiveContainer></div><div className="chart-foot"><span>Daily average <strong>{formatDuration(Math.round(week / 7))}</strong></span><span>Strongest day <strong>Wednesday</strong></span><span>vs last week <strong className="cyan-text">+2h 46m</strong></span></div></Panel>
      <Panel className="realm-distribution"><SectionHeader title="Realm distribution" kicker="All focused time" /><div className="donut-wrap"><div className="donut-chart"><ResponsiveContainer><PieChart><Pie data={realmData} dataKey="minutes" innerRadius={58} outerRadius={76} paddingAngle={4} stroke="none">{realmData.map((realm) => <Cell key={realm.id} fill={realm.color} />)}</Pie></PieChart></ResponsiveContainer><div><strong>{formatDuration(lifetime)}</strong><span>total</span></div></div><div className="legend-list">{realmData.map((realm) => <div key={realm.id}><i style={{ background: realm.color }} /><span>{realm.name}</span><strong>{Math.round(realm.minutes / Math.max(lifetime, 1) * 100)}%</strong><small>{formatDuration(realm.minutes)}</small></div>)}</div></div></Panel>
    </div>
    <div className="time-bottom-grid">
      <Panel><SectionHeader title="Most explored quests" kicker="Topic-wise breakdown" /><div className="topic-rank-list">{topicData.map((item, index) => { const language = data.languages.find((entry) => entry.id === item.topic.languageId)!; return <div key={item.topic.id}><span className="rank">0{index + 1}</span><LanguageSigil language={language} size="sm" /><div><strong>{item.topic.name}</strong><small>{language.name}</small><ProgressBar value={item.minutes / topicData[0].minutes * 100} color={language.color} subtle /></div><b>{formatDuration(item.minutes)}</b>{index === topicData.length - 1 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}</div>; })}</div></Panel>
      <Panel className="focus-insight"><SectionHeader title="A pattern emerges" kicker="Vault insight" /><div className="insight-graphic"><span><i /><i /><i /><i /><i /></span><strong>19:00—21:00</strong><small>Your clearest focus window</small></div><p>You complete <strong>28% longer sessions</strong> in the evening. Your Python work is also most consistent on weekdays.</p><button className="text-button">Open Observatory <ArrowUpRight size={14} /></button></Panel>
    </div>
  </div>;
}
