import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, Radio, Square } from 'lucide-react';
import { useQuestStore } from '../store/useQuestStore';
import { LanguageSigil } from './ui/Primitives';

export function SessionDock({ full = false }: { full?: boolean }) {
  const { data, startSession, stopSession } = useQuestStore();
  const [languageId, setLanguageId] = useState(data.languages[0]?.id ?? '');
  const available = useMemo(() => data.topics.filter((topic) => topic.languageId === languageId && topic.status !== 'completed'), [data.topics, languageId]);
  const [topicId, setTopicId] = useState(available[0]?.id ?? '');
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { if (!available.some((topic) => topic.id === topicId)) setTopicId(available[0]?.id ?? ''); }, [available, topicId]);
  useEffect(() => {
    if (!data.activeSession) { setElapsed(0); return; }
    const update = () => setElapsed(Math.max(0, Math.floor((Date.now() - data.activeSession!.startedAt) / 1000)));
    update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer);
  }, [data.activeSession]);
  const activeLanguage = data.languages.find((language) => language.id === data.activeSession?.languageId);
  const activeTopic = data.topics.find((topic) => topic.id === data.activeSession?.topicId);
  const selectedLanguage = data.languages.find((language) => language.id === languageId);
  const time = `${String(Math.floor(elapsed / 3600)).padStart(2, '0')}:${String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  if (data.activeSession && activeLanguage) return (
    <div className={`session-dock active ${full ? 'full' : ''}`}>
      <div className="session-live"><Radio size={14} /><span>Focus channel live</span></div>
      <div className="session-focus"><LanguageSigil language={activeLanguage} /><div><strong>{activeTopic?.name}</strong><span>{activeLanguage.name} realm</span></div></div>
      <div className="session-clock">{time}</div>
      <div className="session-wave"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="session-buttons"><button className="icon-button" title="Pause timer"><Pause size={17} /></button><button className="primary danger" onClick={() => stopSession()}><Square size={15} fill="currentColor" />End session</button></div>
    </div>
  );

  return (
    <div className={`session-dock ${full ? 'full' : ''}`}>
      <div className="session-live idle"><span />Ready when you are</div>
      <div className="session-selectors">
        <label>Realm<select value={languageId} onChange={(event) => setLanguageId(event.target.value)}>{data.languages.map((language) => <option key={language.id} value={language.id}>{language.name}</option>)}</select></label>
        <label>Current quest<select value={topicId} onChange={(event) => setTopicId(event.target.value)}>{available.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
      </div>
      <button className="primary session-start" disabled={!topicId} onClick={() => startSession(languageId, topicId)}><Play size={16} fill="currentColor" />Start focus session</button>
      {selectedLanguage && <p className="session-hint">Continue building your {selectedLanguage.name} realm</p>}
    </div>
  );
}
