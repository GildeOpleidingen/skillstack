DROP VIEW IF EXISTS v_submissions;
CREATE VIEW v_submissions AS
SELECT 
  s.id,
  s.exercise_id,
  s.submitted_code,
  t.id AS type_id,
  t.name AS type_name,
  u.github_id AS user_id,
  s.graded
FROM submissions AS s 
LEFT JOIN exercises AS e ON e.id = s.exercise_id 
LEFT JOIN exercise_categories AS c ON c.id = e.category_id
LEFT JOIN types AS t ON c.type_id = t.id
LEFT JOIN users AS u ON u.github_id = s.user_id
/* v_submissions(id,exercise_id,submitted_code,type_id,type_name,user_id,graded) */;

