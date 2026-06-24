PRAGMA foreign_keys = ON;

CREATE TABLE languages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sigil TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  language_id TEXT NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK(status IN ('not-started', 'in-progress', 'completed')),
  deadline TEXT,
  estimated_hours REAL NOT NULL DEFAULT 0,
  actual_hours REAL NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  personal_summary TEXT
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  language_id TEXT NOT NULL REFERENCES languages(id),
  topic_id TEXT NOT NULL REFERENCES topics(id),
  session_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK(duration_minutes >= 0),
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  uri TEXT
);

CREATE TABLE revisions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  revision_date TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  next_revision TEXT
);

CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked_at TEXT
);

CREATE TABLE future_goals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('Languages', 'Skills', 'Projects', 'Challenges')),
  target_start TEXT NOT NULL,
  priority INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_topics_language ON topics(language_id, sort_order);
CREATE INDEX idx_sessions_date ON sessions(session_date DESC);
CREATE INDEX idx_revisions_topic ON revisions(topic_id, revision_date DESC);
