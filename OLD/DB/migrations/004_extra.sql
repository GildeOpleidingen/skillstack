CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE user_skills (
    user_id INTEGER,
    skill_id INTEGER,
    level INTEGER DEFAULT 0,  -- Level of proficiency (e.g., 0-5)
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users (github_id),
    FOREIGN KEY (skill_id) REFERENCES skills (id)
);

CREATE TABLE forum_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (github_id)
);

CREATE TABLE forum_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts (id),
    FOREIGN KEY (user_id) REFERENCES users (github_id)
);


CREATE TABLE challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATETIME,
    end_date DATETIME,
    max_score INTEGER
);

CREATE TABLE user_challenges (
    user_id INTEGER,
    challenge_id INTEGER,
    score INTEGER,
    completed_at DATETIME,
    PRIMARY KEY (user_id, challenge_id),
    FOREIGN KEY (user_id) REFERENCES users (github_id),
    FOREIGN KEY (challenge_id) REFERENCES challenges (id)
);

CREATE TABLE video_guides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT
);

CREATE TABLE documentation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    url TEXT
);
