-- USERS
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  handle VARCHAR(32) NOT NULL UNIQUE,
  email VARCHAR(254) NULL UNIQUE,
  password_hash VARBINARY(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- CONTESTS
CREATE TABLE contests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  status ENUM('upcoming','running','finished') NOT NULL DEFAULT 'upcoming',
  created_by BIGINT UNSIGNED NULL,
  INDEX (start_time),
  INDEX (end_time),
  CONSTRAINT fk_contests_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- PROBLEMS (global catalog)
CREATE TABLE problems (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,           -- e.g. "A", "B" in your own scheme or a global id
  title VARCHAR(255) NOT NULL,
  statement MEDIUMTEXT NULL,                 -- store text or keep as pointer to object storage
  time_limit_ms INT NOT NULL DEFAULT 1000,
  memory_limit_kb INT NOT NULL DEFAULT 256000,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- PROBLEMS inside contests (mapping + per-contest visibility/settings)
CREATE TABLE contest_problems (
  contest_id BIGINT UNSIGNED NOT NULL,
  problem_id BIGINT UNSIGNED NOT NULL,
  idx VARCHAR(8) NOT NULL,                  -- e.g. "A", "B", "C"
  sort_order INT NOT NULL DEFAULT 0,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (contest_id, problem_id),
  UNIQUE KEY uq_contest_idx (contest_id, idx),
  CONSTRAINT fk_cp_contest FOREIGN KEY (contest_id) REFERENCES contests(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cp_problem FOREIGN KEY (problem_id) REFERENCES problems(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- CONTEST PARTICIPANTS (individual; teams optional later)
CREATE TABLE contest_participants (
  contest_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (contest_id, user_id),
  CONSTRAINT fk_part_contest FOREIGN KEY (contest_id) REFERENCES contests(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_part_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- SUBMISSIONS
CREATE TABLE submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contest_id BIGINT UNSIGNED NULL,         -- NULL for non-contest (if you support it)
  problem_id BIGINT UNSIGNED NOT NULL,   -- can also reference contest_problems (via both keys)
  author_user_id BIGINT UNSIGNED NOT NULL,
  language VARCHAR(32) NOT NULL,         -- "GNU C++17", "Python 3", etc.
  source_code MEDIUMTEXT NOT NULL,       -- or store pointer to object storage
  status ENUM('queued','judging','accepted','wrong_answer','runtime_error',
              'time_limit_exceeded','memory_limit_exceeded','compile_error','system_error')
            NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sub_contest FOREIGN KEY (contest_id) REFERENCES contests(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_sub_problem FOREIGN KEY (problem_id) REFERENCES problems(id),
  CONSTRAINT fk_sub_author FOREIGN KEY (author_user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_submissions_problem_created ON submissions(problem_id, created_at);
CREATE INDEX idx_submissions_author_created ON submissions(author_user_id, created_at);

-- JUDGING RUNS (allows multiple runs/rejudge)
CREATE TABLE submission_runs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id BIGINT UNSIGNED NOT NULL,
  started_at DATETIME NULL,
  finished_at DATETIME NULL,
  final_verdict ENUM('pending','accepted','wrong_answer','runtime_error',
                      'time_limit_exceeded','memory_limit_exceeded',
                      'compile_error','system_error') NOT NULL DEFAULT 'pending',
  score INT NULL,          -- for partial scoring
  max_time_ms INT NULL,
  max_memory_kb INT NULL,
  CONSTRAINT fk_run_submission FOREIGN KEY (submission_id) REFERENCES submissions(id)
    ON DELETE CASCADE,
  INDEX (submission_id)
) ENGINE=InnoDB;

-- TESTCASES (global per problem)
CREATE TABLE testcases (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  problem_id BIGINT UNSIGNED NOT NULL,
  tc_index INT NOT NULL,                         -- 0..N-1
  is_public BOOLEAN NOT NULL DEFAULT FALSE,      -- optional
  input_data MEDIUMBLOB NULL,                   -- or storage pointer (recommended)
  expected_output MEDIUMBLOB NULL,
  weight INT NOT NULL DEFAULT 1,               -- for scoring
  UNIQUE KEY uq_problem_tc (problem_id, tc_index),
  CONSTRAINT fk_tc_problem FOREIGN KEY (problem_id) REFERENCES problems(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- PER-TESTCASE RESULTS
CREATE TABLE testcase_results (
  run_id BIGINT UNSIGNED NOT NULL,
  testcase_id BIGINT UNSIGNED NOT NULL,
  verdict ENUM('pending','accepted','wrong_answer','runtime_error',
                'time_limit_exceeded','memory_limit_exceeded',
                'output_limit_exceeded','system_error') NOT NULL,
  time_ms INT NULL,
  memory_kb INT NULL,
  stdout_snippet TEXT NULL,        -- optional
  stderr_snippet TEXT NULL,        -- optional
  PRIMARY KEY (run_id, testcase_id),
  CONSTRAINT fk_tr_run FOREIGN KEY (run_id) REFERENCES submission_runs(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_tr_tc FOREIGN KEY (testcase_id) REFERENCES testcases(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- STANDINGS (snapshot table for fast reads)
CREATE TABLE standings_entries (
  contest_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  solved_count INT NOT NULL DEFAULT 0,
  penalty BIGINT NOT NULL DEFAULT 0,      -- ICPC penalty, or use score column instead
  score INT NULL,                          -- if you do non-ICPC scoring
  last_update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (contest_id, user_id),
  INDEX (contest_id, solved_count, penalty),
  CONSTRAINT fk_st_contest FOREIGN KEY (contest_id) REFERENCES contests(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_st_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;



