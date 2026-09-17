-- LEARNING ROADMAPS
CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- MILESTONES / CHAPTERS
CREATE TABLE IF NOT EXISTS  roadmap_milestones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    roadmap_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    required_previous_milestone_id BIGINT UNSIGNED NULL,

    FOREIGN KEY (roadmap_id)
        REFERENCES learning_roadmaps(id)
        ON DELETE CASCADE,

    FOREIGN KEY (required_previous_milestone_id)
        REFERENCES roadmap_milestones(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- PROBLEMS INSIDE A ROADMAP
CREATE TABLE IF NOT EXISTS  roadmap_problems (
    milestone_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 100,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (milestone_id, problem_id),

    FOREIGN KEY (milestone_id)
        REFERENCES roadmap_milestones(id)
        ON DELETE CASCADE,

    FOREIGN KEY (problem_id)
        REFERENCES problems(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- STUDENT PROGRESS
CREATE TABLE IF NOT EXISTS student_problem_progress (
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    status ENUM('not_started','attempted','solved')
        NOT NULL DEFAULT 'not_started',
    best_score INT NOT NULL DEFAULT 0,
    solved_at DATETIME NULL,
    attempts INT NOT NULL DEFAULT 0,

    PRIMARY KEY (user_id, problem_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (problem_id)
        REFERENCES problems(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;