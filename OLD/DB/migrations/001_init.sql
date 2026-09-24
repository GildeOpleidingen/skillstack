-- users table
CREATE TABLE IF NOT EXISTS users (
    github_username TEXT PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    company TEXT,
    location TEXT,
    blog TEXT,
    github_id INTEGER,
    created_at TEXT,
    updated_at TEXT
);

-- exercises
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    input TEXT,
    expected_output TEXT,
    max_score INTEGER
);

-- sessions
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- add a table for test‑cases
CREATE TABLE IF NOT EXISTS exercise_tests (
  id INTEGER PRIMARY KEY,
  exercise_id INTEGER,
  input TEXT,
  expected_output TEXT,
  points INTEGER             -- weight of this test
);

-- submissions table you already have
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  exercise_id INTEGER,
  submitted_code TEXT,
  result TEXT,               -- e.g. 'Accepted', 'Wrong answer (test #3)', 'CE', 'TLE'
  score INTEGER,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  graded_at    DATETIME,
  graded INTEGER DEFAULT 0   -- 0 = waiting, 1 = graded
);

CREATE TABLE IF NOT EXISTS exercise_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

ALTER TABLE exercise_categories ADD COLUMN icon TEXT;
ALTER TABLE exercise_categories ADD COLUMN sort_id INTEGER;
ALTER TABLE exercise_categories ADD COLUMN  type TEXT CHECK (type IN ('python', 'c++', 'nodejs')); 
ALTER TABLE exercises ADD COLUMN category_id INTEGER REFERENCES exercise_categories(id);

-- 20250716 added to see more of the result and errors
ALTER TABLE submissions ADD COLUMN compile_res TEXT;
ALTER TABLE submissions ADD COLUMN test_res TEXT;
ALTER TABLE submissions ADD COLUMN test_error TEXT;

ALTER TABLE exercises ADD COLUMN sub_id INTEGER;
