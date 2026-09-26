-- View: v_exercises_with_category
DROP VIEW IF EXISTS v_exercises_with_category;
CREATE VIEW v_exercises_with_category AS
SELECT
  e.id, 
  e.title, 
  e.description,
  e.max_score, 

  -- The subcategory
  c.id AS category_id, 
  c.name AS category_name, 
  c.icon AS category_icon,

  -- The parent (language type)
  t.id AS type_id,
  t.name AS type_name,
  t.icon AS type_icon,

  ut.github_id AS github_id,
  c.sort_id AS category_sort_id
FROM exercises e
LEFT JOIN exercise_categories c ON e.category_id = c.id
LEFT JOIN types t ON c.type_id = t.id
LEFT JOIN user_selected_types ut ON ut.type_id = t.id
ORDER BY t.sort_id, c.sort_id, e.id;
/* v_exercises_with_category(id,title,description,max_score,category_id,category_name,category_icon,type_id,type_name,type_icon,github_id,category_sort_id) */

