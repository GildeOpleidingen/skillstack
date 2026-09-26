DROP VIEW IF EXISTS v_user_skills;
CREATE VIEW v_user_skills AS
SELECT 
  us.user_id,
  s.name AS skill_name,
  us.xp,
  (us.xp / 10) AS level   -- every 10 XP = +1 level
FROM user_skills us
JOIN skills s ON s.id = us.skill_id;
