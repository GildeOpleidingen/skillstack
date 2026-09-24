INSERT INTO exercise_categories (id, name, icon, sort_id, type)
VALUES (5, 'Exercises NodeJS', '🧪', 6, 'nodejs')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  icon = excluded.icon,
  sort_id = excluded.sort_id,
  type = excluded.type;

UPDATE exercise_categories SET name='Exercises C++' WHERE id=2;
UPDATE exercise_categories SET name='Quests C++' WHERE id=3;

INSERT INTO exercise_categories (id, name, icon, sort_id, type)
VALUES (6, 'Quests NodeJS', '🧪', 20, 'nodejs')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  icon = excluded.icon,
  sort_id = excluded.sort_id,
  type = excluded.type;
