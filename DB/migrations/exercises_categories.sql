-- Safety: remove old tables first
DROP TABLE IF EXISTS exercise_categories;
DROP TABLE IF EXISTS types;

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
