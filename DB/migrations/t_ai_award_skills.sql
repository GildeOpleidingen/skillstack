DROP TRIGGER IF EXISTS t_ai_award_skills;
CREATE TRIGGER t_ai_award_skills
AFTER INSERT ON submissions
WHEN NEW.result = 'Accepted'
BEGIN
  INSERT INTO user_skills (user_id, skill_id, xp)
  SELECT NEW.user_id, es.skill_id, 1   -- always give 1 XP
  FROM exercise_skills es
  WHERE es.exercise_id = NEW.exercise_id
  ON CONFLICT(user_id, skill_id)
  DO UPDATE SET xp = xp + 1;
END;
