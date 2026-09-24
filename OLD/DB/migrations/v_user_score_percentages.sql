-- View: user_score_percentages
DROP VIEW IF EXISTS v_user_score_percentages;
CREATE VIEW v_user_score_percentages AS
SELECT
  s.user_id,
  SUM(e.max_score) AS score,
  (
    SELECT SUM(e2.max_score)
    FROM exercises e2
    JOIN exercise_categories ec2 ON e2.category_id = ec2.id
    JOIN types t2 ON ec2.type_id = t2.id
    JOIN user_selected_types ust2 ON ust2.type_id = t2.id AND ust2.github_id = s.user_id
  ) AS max_score,
  ROUND(
    100.0 * SUM(e.max_score) /
    (
      SELECT SUM(e2.max_score)
      FROM exercises e2
      JOIN exercise_categories ec2 ON e2.category_id = ec2.id
      JOIN types t2 ON ec2.type_id = t2.id
      JOIN user_selected_types ust2 ON ust2.type_id = t2.id AND ust2.github_id = s.user_id
    ),
    2
  ) AS percentage_score
FROM submissions s
JOIN exercises e ON s.exercise_id = e.id
JOIN exercise_categories ec ON e.category_id = ec.id
JOIN types t ON ec.type_id = t.id
JOIN user_selected_types ust ON ust.type_id = t.id AND ust.github_id = s.user_id
WHERE s.result = 'Accepted'
GROUP BY s.user_id;
/* user_score_percentages(user_id,score,max_score,percentage_score) */
