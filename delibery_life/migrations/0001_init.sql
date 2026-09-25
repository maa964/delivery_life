-- settings: 単一行（id = 1）で目標ポイントを保持
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  goal INTEGER NOT NULL DEFAULT 3000
);

INSERT OR IGNORE INTO settings (id, goal) VALUES (1, 3000);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cat TEXT NOT NULL,
  points INTEGER NOT NULL CHECK (points >= 1 AND points <= 100000),
  minutes INTEGER NOT NULL DEFAULT 0 CHECK (minutes >= 0 AND minutes <= 1440),
  date TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks (date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at);
