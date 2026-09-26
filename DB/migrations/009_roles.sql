
DROP  TABLE  IF EXISTS roles;
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('admin'), ('teacher'), ('student');

DROP  TABLE IF EXISTS user_roles;
CREATE TABLE user_roles (
    user_github_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_github_id, role_id),
    FOREIGN KEY (user_github_id) REFERENCES users(github_id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
