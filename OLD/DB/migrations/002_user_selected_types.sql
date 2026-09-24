DROP TABLE IF EXISTS user_selected_types;
CREATE TABLE user_selected_types (
    github_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('python', 'c++', 'nodejs')),
    selected_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (github_id, type),
    FOREIGN KEY (github_id) REFERENCES users (github_id)
);
