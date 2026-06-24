import Database from '@tauri-apps/plugin-sql';
import type { AppData } from '../types';
import { seedData } from '../data/seed';

const browserKey = 'codequest-local-state-v1';
let database: Database | null = null;
let saveQueue: Promise<void> = Promise.resolve();

const isTauri = () => '__TAURI_INTERNALS__' in window;

const schema = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS languages (id TEXT PRIMARY KEY, name TEXT NOT NULL, sigil TEXT NOT NULL, color TEXT NOT NULL, description TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS topics (id TEXT PRIMARY KEY, language_id TEXT NOT NULL REFERENCES languages(id) ON DELETE CASCADE, parent_id TEXT REFERENCES topics(id) ON DELETE CASCADE, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL CHECK(status IN ('not-started','in-progress','completed')), deadline TEXT, estimated_hours REAL NOT NULL DEFAULT 0, actual_hours REAL NOT NULL DEFAULT 0, notes TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, completed_at TEXT, personal_summary TEXT);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, language_id TEXT NOT NULL REFERENCES languages(id), topic_id TEXT NOT NULL REFERENCES topics(id), session_date TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT NOT NULL, duration_minutes INTEGER NOT NULL, notes TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS resources (id INTEGER PRIMARY KEY AUTOINCREMENT, topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE, label TEXT NOT NULL, uri TEXT);
CREATE TABLE IF NOT EXISTS revisions (id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE, revision_date TEXT NOT NULL, notes TEXT NOT NULL DEFAULT '', next_revision TEXT);
CREATE TABLE IF NOT EXISTS achievements (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, icon TEXT NOT NULL, unlocked_at TEXT);
CREATE TABLE IF NOT EXISTS future_goals (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, target_start TEXT NOT NULL, priority INTEGER NOT NULL, description TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK(id = 1), payload TEXT NOT NULL, updated_at TEXT NOT NULL);
`;

export async function loadLocalData(): Promise<AppData> {
  if (!isTauri()) {
    const saved = localStorage.getItem(browserKey);
    return saved ? JSON.parse(saved) as AppData : seedData;
  }
  database = await Database.load('sqlite:codequest.db');
  for (const statement of schema.split(';').map((part) => part.trim()).filter(Boolean)) await database.execute(`${statement};`);
  const rows = await database.select<{ payload: string }[]>('SELECT payload FROM app_state WHERE id = 1');
  if (rows[0]) return JSON.parse(rows[0].payload) as AppData;
  await saveLocalData(seedData);
  return seedData;
}

export function saveLocalData(data: AppData) {
  const payload = JSON.stringify(data);
  if (!isTauri()) {
    localStorage.setItem(browserKey, payload);
    return Promise.resolve();
  }
  saveQueue = saveQueue.then(async () => {
    database ??= await Database.load('sqlite:codequest.db');
    await database.execute(
      `INSERT INTO app_state (id, payload, updated_at) VALUES (1, $1, $2)
       ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
      [payload, new Date().toISOString()],
    );
  });
  return saveQueue;
}

export function resetBrowserData() {
  localStorage.removeItem(browserKey);
}
