export type PageId = 'dashboard' | 'journey' | 'roadmaps' | 'time' | 'analytics' | 'future' | 'knowledge' | 'settings';
export type TopicStatus = 'not-started' | 'in-progress' | 'completed';
export type Accent = 'cyan' | 'violet' | 'amber' | 'mint';

export interface Topic {
  id: string;
  languageId: string;
  parentId?: string;
  name: string;
  description: string;
  status: TopicStatus;
  deadline?: string;
  estimatedHours: number;
  actualHours: number;
  notes: string;
  order: number;
  completedAt?: string;
  resources?: string[];
  summary?: string;
}

export interface Language {
  id: string;
  name: string;
  sigil: string;
  color: string;
  description: string;
}

export interface StudySession {
  id: string;
  languageId: string;
  topicId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes: string;
  completedItems?: string[];
}

export interface Revision {
  id: string;
  topicId: string;
  date: string;
  notes: string;
  nextRevision?: string;
}

export interface FutureGoal {
  id: string;
  title: string;
  category: 'Languages' | 'Skills' | 'Projects' | 'Challenges';
  targetStart: string;
  priority: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface ActiveSession {
  languageId: string;
  topicId: string;
  startedAt: number;
}

export interface Preferences {
  accent: Accent;
  notifications: boolean;
  revisionReminders: boolean;
  compactMotion: boolean;
}

export interface AppData {
  languages: Language[];
  topics: Topic[];
  sessions: StudySession[];
  revisions: Revision[];
  futureGoals: FutureGoal[];
  achievements: Achievement[];
  activeSession: ActiveSession | null;
  preferences: Preferences;
}
