import { create } from 'zustand';
import { seedData } from '../data/seed';
import { loadLocalData, saveLocalData } from '../lib/database';
import { todayIso, uid } from '../lib/format';
import type { Accent, AppData, FutureGoal, Language, PageId, Topic, TopicStatus } from '../types';

interface QuestStore {
  data: AppData;
  page: PageId;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setPage: (page: PageId) => void;
  startSession: (languageId: string, topicId: string) => void;
  stopSession: (notes?: string) => void;
  setTopicStatus: (topicId: string, status: TopicStatus) => void;
  addLanguage: (language: Omit<Language, 'id'>) => string;
  addTopic: (topic: Omit<Topic, 'id' | 'actualHours' | 'order' | 'notes'>) => void;
  addRevision: (topicId: string, notes: string) => void;
  addFutureGoal: (goal: Omit<FutureGoal, 'id' | 'priority'>) => void;
  reorderFutureGoal: (draggedId: string, targetId: string) => void;
  removeFutureGoal: (id: string) => void;
  setPreference: (key: keyof AppData['preferences'], value: boolean | Accent) => void;
  importData: (data: AppData) => void;
}

const persist = (data: AppData) => void saveLocalData(data);

export const useQuestStore = create<QuestStore>((set, get) => ({
  data: seedData,
  page: 'dashboard',
  hydrated: false,
  hydrate: async () => {
    const data = await loadLocalData();
    set({ data, hydrated: true });
  },
  setPage: (page) => set({ page }),
  startSession: (languageId, topicId) => {
    const data = { ...get().data, activeSession: { languageId, topicId, startedAt: Date.now() } };
    set({ data }); persist(data);
  },
  stopSession: (notes = '') => {
    const current = get().data;
    if (!current.activeSession) return;
    const started = new Date(current.activeSession.startedAt);
    const ended = new Date();
    const durationMinutes = Math.max(1, Math.round((ended.getTime() - started.getTime()) / 60_000));
    const session = {
      id: uid('session'), languageId: current.activeSession.languageId, topicId: current.activeSession.topicId,
      date: todayIso(), startTime: started.toTimeString().slice(0, 5), endTime: ended.toTimeString().slice(0, 5),
      durationMinutes, notes: notes || 'Focused session.',
    };
    const data = { ...current, sessions: [session, ...current.sessions], activeSession: null };
    set({ data }); persist(data);
  },
  setTopicStatus: (topicId, status) => {
    const current = get().data;
    const data = { ...current, topics: current.topics.map((topic) => topic.id === topicId
      ? { ...topic, status, completedAt: status === 'completed' ? todayIso() : undefined }
      : topic) };
    set({ data }); persist(data);
  },
  addLanguage: (language) => {
    const current = get().data; const id = uid('realm');
    const data = { ...current, languages: [...current.languages, { ...language, id }] };
    set({ data }); persist(data); return id;
  },
  addTopic: (topic) => {
    const current = get().data;
    const order = current.topics.filter((item) => item.languageId === topic.languageId && item.parentId === topic.parentId).length;
    const data = { ...current, topics: [...current.topics, { ...topic, id: uid('topic'), actualHours: 0, order, notes: '' }] };
    set({ data }); persist(data);
  },
  addRevision: (topicId, notes) => {
    const current = get().data;
    const next = new Date(); next.setDate(next.getDate() + 30);
    const data = { ...current, revisions: [{ id: uid('revision'), topicId, date: todayIso(), notes, nextRevision: next.toISOString().slice(0, 10) }, ...current.revisions] };
    set({ data }); persist(data);
  },
  addFutureGoal: (goal) => {
    const current = get().data;
    const data = { ...current, futureGoals: [...current.futureGoals, { ...goal, id: uid('goal'), priority: current.futureGoals.length }] };
    set({ data }); persist(data);
  },
  reorderFutureGoal: (draggedId, targetId) => {
    const current = get().data;
    const goals = [...current.futureGoals];
    const from = goals.findIndex((goal) => goal.id === draggedId); const to = goals.findIndex((goal) => goal.id === targetId);
    if (from < 0 || to < 0) return;
    const [dragged] = goals.splice(from, 1); goals.splice(to, 0, dragged);
    const data = { ...current, futureGoals: goals.map((goal, priority) => ({ ...goal, priority })) };
    set({ data }); persist(data);
  },
  removeFutureGoal: (id) => {
    const current = get().data; const data = { ...current, futureGoals: current.futureGoals.filter((goal) => goal.id !== id) };
    set({ data }); persist(data);
  },
  setPreference: (key, value) => {
    const current = get().data; const data = { ...current, preferences: { ...current.preferences, [key]: value } };
    set({ data }); persist(data);
  },
  importData: (data) => { set({ data }); persist(data); },
}));
