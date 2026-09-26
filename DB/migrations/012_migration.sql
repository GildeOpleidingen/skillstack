-- Copy exercise.description into exercise_blocks as HTML text blocks
INSERT INTO exercise_blocks (exercise_id, block_type, content, sort_order)
SELECT id, 'text', description, 1
FROM exercises
WHERE description IS NOT NULL AND TRIM(description) <> '';
