
DELETE FROM exercise_skills;

-- =====================
-- C++ Basics
-- =====================

-- Hello World -> Functions + File I/O (printing)
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Hello World'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Hello World'
  AND s.name = 'File I/O';

-- Print your name -> Functions + File I/O
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Print Your Name'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Print Your Name'
  AND s.name = 'File I/O';

-- Add two numbers (fixed) -> Algorithms + Arithmetic/Data Manipulation
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Add Two Numbers'
  AND s.name = 'Algorithms';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Add Two Numbers'
  AND s.name = 'Data Manipulation';

-- Read integer input -> File I/O + Debugging (handling input)
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Read Integer'
  AND s.name = 'File I/O';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Read Integer'
  AND s.name = 'Debugging';

-- Add two input numbers -> Algorithms + File I/O
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Add Two Input Numbers'
  AND s.name = 'Algorithms';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Add Two Input Numbers'
  AND s.name = 'File I/O';

-- =====================
-- Beginner logical thinking
-- =====================

-- Boy or Girl -> Conditionals + Debugging (logic reasoning)
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Boy or Girl'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Boy or Girl'
  AND s.name = 'Debugging';

-- Multiply Two Numbers -> Algorithms + Data Manipulation
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Multiply Two Numbers'
  AND s.name = 'Algorithms';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Multiply Two Numbers'
  AND s.name = 'Data Manipulation';

-- Find Average -> Algorithms + Data Manipulation
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Find Average'
  AND s.name = 'Algorithms';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Find Average'
  AND s.name = 'Data Manipulation';

-- Even or Odd -> Conditionals + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Even or Odd'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Even or Odd'
  AND s.name = 'Algorithms';

-- Maximum of Two Numbers -> Conditionals + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Maximum of Two Numbers'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Maximum of Two Numbers'
  AND s.name = 'Algorithms';

-- Celsius to Fahrenheit -> Algorithms + Data Manipulation
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Celsius to Fahrenheit'
  AND s.name = 'Algorithms';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Celsius to Fahrenheit'
  AND s.name = 'Data Manipulation';

-- Pass/Fail -> Conditionals + Debugging
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Pass or Fail'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Pass or Fail'
  AND s.name = 'Debugging';

-- Print Numbers 1..N -> Loops + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Print Numbers 1..N'
  AND s.name = 'Loops';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Print Numbers 1..N'
  AND s.name = 'Algorithms';

-- Sum of N Numbers -> Loops + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Sum N Numbers'
  AND s.name = 'Loops';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Sum N Numbers'
  AND s.name = 'Algorithms';

-- Star Triangle -> Loops + Vectors
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Star Triangle'
  AND s.name = 'Loops';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Star Triangle'
  AND s.name = 'Vectors';

-- Team Decision -> Conditionals + Debugging
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Team Decision'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Team Decision'
  AND s.name = 'Debugging';



-- =====================
-- JavaScript Basics
-- =====================

-- Hello JavaScript -> Functions + File I/O
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Hello JavaScript'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Hello JavaScript'
  AND s.name = 'File I/O';

-- Emoji Logger -> Functions + File I/O
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Emoji Logger'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Emoji Logger'
  AND s.name = 'File I/O';

-- Mood -> Objects + Debugging
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Mood'
  AND s.name = 'Objects';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Mood'
  AND s.name = 'Debugging';

-- Join Text and Variable -> Objects + Data Manipulation
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Join Text and Variable'
  AND s.name = 'Objects';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Join Text and Variable'
  AND s.name = 'Data Manipulation';

-- Greeting with Input -> Functions + File I/O
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Greeting with Input'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Greeting with Input'
  AND s.name = 'File I/O';

-- Combine Words -> Objects + Data Manipulation
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Combine Words'
  AND s.name = 'Objects';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Combine Words'
  AND s.name = 'Data Manipulation';

-- Favorite Color -> File I/O + Conditionals
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Favorite Color'
  AND s.name = 'File I/O';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Favorite Color'
  AND s.name = 'Conditionals';

-- Repeat After Me -> File I/O + Functions
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Repeat After Me'
  AND s.name = 'File I/O';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Repeat After Me'
  AND s.name = 'Functions';

-- Make a Sentence -> Objects + Data Manipulation
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Make a Sentence'
  AND s.name = 'Objects';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Make a Sentence'
  AND s.name = 'Data Manipulation';

-- Age Check -> Conditionals + Debugging
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Age Check'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Age Check'
  AND s.name = 'Debugging';

-- Is it Raining -> Conditionals + Objects
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Is It Raining'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Is It Raining'
  AND s.name = 'Objects';

-- Guess My Number -> Conditionals + Loops
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Guess My Number'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Guess My Number'
  AND s.name = 'Loops';

-- Password Check -> Conditionals + Debugging
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Password Check'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Password Check'
  AND s.name = 'Debugging';

-- Positive/Negative/Zero -> Conditionals + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Positive/Negative/Zero'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Positive/Negative/Zero'
  AND s.name = 'Algorithms';

-- Even or Odd (JS) -> Conditionals + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Even or Odd (JS)'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Even or Odd (JS)'
  AND s.name = 'Algorithms';

-- Maximum of Two Numbers (JS) -> Conditionals + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Maximum of Two Numbers (JS)'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Maximum of Two Numbers (JS)'
  AND s.name = 'Algorithms';

-- =====================
-- JavaScript Functions
-- =====================

-- Say Hello Function -> Functions + File I/O
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Say Hello Function'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Say Hello Function'
  AND s.name = 'File I/O';

-- Greet by Name -> Functions + Objects
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Greet by Name'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Greet by Name'
  AND s.name = 'Objects';

-- Square a Number -> Functions + Algorithms
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Square a Number'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Square a Number'
  AND s.name = 'Algorithms';

-- Absolute Value -> Functions + Conditionals
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Absolute Value'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Absolute Value'
  AND s.name = 'Conditionals';

-- Is Positive -> Functions + Conditionals
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Is Positive'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Is Positive'
  AND s.name = 'Conditionals';

-- Minimum of Two Numbers -> Functions + Conditionals
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Minimum of Two Numbers'
  AND s.name = 'Functions';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Minimum of Two Numbers'
  AND s.name = 'Conditionals';

-- Team Decision (JS) -> Conditionals + Debugging
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 2
FROM exercises e, skills s
WHERE e.title = 'Team Decision (JS)'
  AND s.name = 'Conditionals';
INSERT INTO exercise_skills (exercise_id, skill_id, points)
SELECT e.id, s.id, 1
FROM exercises e, skills s
WHERE e.title = 'Team Decision (JS)'
  AND s.name = 'Debugging';

