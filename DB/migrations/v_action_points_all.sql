-- View: v_action_points_all
DROP VIEW IF EXISTS v_action_points_all;
CREATE VIEW v_action_points_all AS
WITH last_graded AS (
  SELECT s1.*
  FROM submissions s1
  WHERE s1.graded = 1
    AND s1.id = (
      SELECT MAX(s2.id)
      FROM submissions s2
      WHERE s2.user_id = s1.user_id
        AND s2.exercise_id = s1.exercise_id
        AND s2.graded = 1
    )
)
SELECT
  e.id AS exercise_id,
  u.github_id AS user_id,
  e.title,
  c.id AS category_id,
  c.name AS category_name,
  COALESCE(s.score, 0) AS last_score,
  e.max_score,
  COALESCE(s.result, 'Not started') AS status
FROM users u
CROSS JOIN exercises e
LEFT JOIN exercise_categories c ON e.category_id = c.id
LEFT JOIN types t ON c.type_id = t.id
LEFT JOIN user_selected_types ut ON ut.type_id = t.id AND ut.github_id = u.github_id
LEFT JOIN last_graded s ON s.user_id = u.github_id AND s.exercise_id = e.id
WHERE e.is_active = 1
  AND ut.type_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM submissions sa
    WHERE sa.user_id = u.github_id
      AND sa.exercise_id = e.id
      AND sa.result = 'Accepted'
  )
ORDER BY t.sort_id, c.sort_id, status, e.title;
