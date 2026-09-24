DROP VIEW IF EXISTS v_leaderboard;
CREATE VIEW v_leaderboard AS
SELECT
  u.github_id,
  u.github_username AS username,
  u.full_name,
  u.avatar_url,
  u.location,
  SUM(e.max_score) AS total_score,
  COUNT(DISTINCT s.exercise_id) AS exercises_solved
FROM users u
LEFT JOIN submissions s ON u.github_id = s.user_id
LEFT JOIN exercises e ON s.exercise_id = e.id
WHERE s.result = 'Accepted'
GROUP BY u.github_username
ORDER BY total_score DESC;