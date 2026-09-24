DROP  TABLE IF EXISTS exercise_blocks;
CREATE TABLE exercise_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    block_type TEXT NOT NULL CHECK (block_type IN ('text', 'image', 'video')),
    content TEXT,             -- For text: HTML/Markdown, for image/video: URL/Embed code
    sort_order INTEGER NOT NULL, -- to control order
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

DROP  TABLE IF EXISTS user_selected_types;
-- Adjusted user_selected_types (references types now)
CREATE TABLE user_selected_types (
    github_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    selected_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (github_id, type_id),
    FOREIGN KEY (github_id) REFERENCES users (github_id),
    FOREIGN KEY (type_id) REFERENCES types (id)
);