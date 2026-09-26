-- Safety: remove old tables first
DROP TABLE IF EXISTS exercise_categories;
DROP TABLE IF EXISTS types;
DROP VIEW IF EXISTS v_action_points_all;
DROP VIEW IF EXISTS v_exercises_with_category;
DROP VIEW IF EXISTS v_submissions;
DROP VIEW IF EXISTS user_score_percentages;
DROP VIEW IF EXISTS v_user_score_percentages;

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- New table for main "types" (languages / root categories)
CREATE TABLE types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,   -- e.g. Python, C++, Node.js
    icon TEXT,
    sort_id INTEGER
);

-- Adjusted categories table
CREATE TABLE exercise_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    icon TEXT,
    sort_id INTEGER,
    type_id INTEGER NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES exercise_categories(id),
    FOREIGN KEY (type_id) REFERENCES types(id)
);

-------------------------------------------------------------------
-- Insert root types (languages)
-------------------------------------------------------------------
INSERT INTO types (id, name, icon, sort_id) VALUES
(1, 'C++',    '💻', 1),
(2, 'NodeJS', '💻', 2),
(3, 'Python', '💻', 3);

-------------------------------------------------------------------
-- Insert categories linked to types
-------------------------------------------------------------------
-- C++ categories
INSERT INTO exercise_categories (id, name, parent_id, icon, sort_id, type_id) VALUES
(4,'Learning',  NULL, '📘', 1, 1),
(5,'Exercises', NULL, '🧪', 5, 1),
(6,'Quests',    NULL, '🏆', 10, 1);

-- NodeJS categories
INSERT INTO exercise_categories (id, name, parent_id, icon, sort_id, type_id) VALUES
(7,'Learning',  NULL, '📘', 1, 2),
(8,'Exercises', NULL, '🧪', 5, 2),
(9,'Quests',    NULL, '🏆', 10, 2);

-- Python categories
INSERT INTO exercise_categories (id, name, parent_id, icon, sort_id, type_id) VALUES
(10,'Learning',  NULL, '📘', 1, 3),
(11,'Exercises', NULL, '🧪', 5, 3),
(12,'Quests',    NULL, '🏆', 10, 3);

COMMIT;



-- 1. Rename the old table
ALTER TABLE exercise_blocks RENAME TO exercise_blocks_old;

-- 2. Create the new table with 'test' allowed
CREATE TABLE exercise_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    block_type TEXT NOT NULL CHECK (block_type IN ('text', 'image', 'video', 'test')),
    content TEXT,
    sort_order INTEGER NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 3. Copy old data
INSERT INTO exercise_blocks (id, exercise_id, block_type, content, sort_order)
SELECT id, exercise_id, block_type, content, sort_order
FROM exercise_blocks_old;

-- 4. Drop the old table
DROP TABLE exercise_blocks_old;

-- 5. Insert the tests
INSERT INTO exercise_blocks (exercise_id, block_type, content, sort_order)
SELECT 
    exercise_id,
    'test' AS block_type,
    -- Combine input and expected output into content (you can adjust format)
    'Input: ' || COALESCE(input, '') || CHAR(10) || 'Expected: ' || COALESCE(expected_output, '') AS content,
    ROW_NUMBER() OVER (PARTITION BY exercise_id ORDER BY id) AS sort_order
FROM exercise_tests;