-- Make RayIT admin
INSERT INTO user_roles (user_github_id, role_id) VALUES (4552322,1);

-- Category hell
UPDATE exercises SET category_id=7 WHERE category_id=4;
UPDATE exercises SET category_id=4 WHERE category_id=1;
UPDATE exercises SET category_id=8 WHERE category_id=5;
UPDATE exercises SET category_id=5 WHERE category_id=2;
UPDATE exercises SET category_id=9 WHERE category_id=6;
UPDATE exercises SET category_id=6 WHERE category_id=3;
