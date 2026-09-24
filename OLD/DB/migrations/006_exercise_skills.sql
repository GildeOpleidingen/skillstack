
CREATE TABLE exercise_skills (
    exercise_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    points INTEGER DEFAULT 1,   -- how much this exercise contributes
    PRIMARY KEY (exercise_id, skill_id),
    FOREIGN KEY (exercise_id) REFERENCES exercises (id),
    FOREIGN KEY (skill_id) REFERENCES skills (id)
);


ALTER TABLE user_skills ADD COLUMN xp INTEGER DEFAULT 0;

