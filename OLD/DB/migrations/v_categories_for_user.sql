-- View: v_categories_for_user
DROP VIEW IF EXISTS v_categories_for_user;
CREATE VIEW v_categories_for_user AS
SELECT
    c.id AS category_id,
    c.name AS category_name,
    c.icon AS category_icon,
    c.sort_id AS category_sort_id,
    c.parent_id,
    ut.github_id,
    t.id AS type_id,
    t.name AS type_name,
    t.icon AS type_icon
FROM exercise_categories c
JOIN types t ON c.type_id = t.id
LEFT JOIN user_selected_types ut ON ut.type_id = t.id
ORDER BY t.sort_id, c.sort_id;
/* v_categories_for_user(category_id,category_name,category_icon,category_sort_id,parent_id,github_id,type_id,type_name,type_icon) */

