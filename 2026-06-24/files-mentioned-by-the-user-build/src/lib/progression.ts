import type { AppData, Language } from '../types';

export const masteryStages = [
  { name: 'Explorer', topics: 0, hours: 0, momentum: 0, revisions: 0 },
  { name: 'Apprentice', topics: 2, hours: 10, momentum: 3, revisions: 0 },
  { name: 'Craftsman', topics: 5, hours: 35, momentum: 7, revisions: 2 },
  { name: 'Architect', topics: 8, hours: 75, momentum: 14, revisions: 5 },
  { name: 'Master', topics: 12, hours: 140, momentum: 30, revisions: 10 },
  { name: 'Sage', topics: 18, hours: 250, momentum: 60, revisions: 20 },
] as const;

export function getMomentum(sessions: AppData['sessions']) {
  const unique = [...new Set(sessions.map((session) => session.date))].sort().reverse();
  if (!unique.length) return 0;
  const latest = new Date(`${unique[0]}T12:00:00`);
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const gap = Math.round((now.getTime() - latest.getTime()) / 86_400_000);
  if (gap > 1) return 0;
  let streak = 1;
  for (let i = 1; i < unique.length; i += 1) {
    const previous = new Date(`${unique[i - 1]}T12:00:00`);
    const current = new Date(`${unique[i]}T12:00:00`);
    if (Math.round((previous.getTime() - current.getTime()) / 86_400_000) !== 1) break;
    streak += 1;
  }
  return streak;
}

export function getLanguageStats(language: Language, data: AppData) {
  const topics = data.topics.filter((topic) => topic.languageId === language.id && !topic.parentId);
  const completed = topics.filter((topic) => topic.status === 'completed').length;
  const sessionMinutes = data.sessions
    .filter((session) => session.languageId === language.id)
    .reduce((sum, session) => sum + session.durationMinutes, 0);
  const actualMinutes = topics.reduce((sum, topic) => sum + topic.actualHours * 60, 0);
  const hours = Math.max(sessionMinutes, actualMinutes) / 60;
  const topicIds = new Set(data.topics.filter((topic) => topic.languageId === language.id).map((topic) => topic.id));
  const revisions = data.revisions.filter((revision) => topicIds.has(revision.topicId)).length;
  const momentum = getMomentum(data.sessions);
  let stageIndex = 0;
  masteryStages.forEach((stage, index) => {
    if (completed >= stage.topics && hours >= stage.hours && momentum >= stage.momentum && revisions >= stage.revisions) stageIndex = index;
  });
  const next = masteryStages[Math.min(stageIndex + 1, masteryStages.length - 1)];
  const gates = [
    next.topics ? Math.min(completed / next.topics, 1) : 1,
    next.hours ? Math.min(hours / next.hours, 1) : 1,
    next.momentum ? Math.min(momentum / next.momentum, 1) : 1,
    next.revisions ? Math.min(revisions / next.revisions, 1) : 1,
  ];
  return {
    completed,
    total: topics.length,
    hours,
    revisions,
    momentum,
    stageIndex,
    stage: masteryStages[stageIndex],
    next,
    progress: stageIndex === masteryStages.length - 1 ? 100 : Math.round(Math.min(...gates) * 100),
  };
}

export function minutesInRange(sessions: AppData['sessions'], days: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return sessions.reduce((sum, session) => {
    const date = new Date(`${session.date}T12:00:00`);
    return date >= start ? sum + session.durationMinutes : sum;
  }, 0);
}
