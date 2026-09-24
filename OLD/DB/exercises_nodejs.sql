-- Remove all...
DELETE FROM exercise_tests
WHERE exercise_id IN (
  SELECT id FROM exercises 
  WHERE category_id = 7 
  OR category_id = 8
  OR category_id = 9
); 
DELETE FROM exercises 
  WHERE category_id = 7 
  OR category_id = 8
  OR category_id = 9;

-- Exercise 1: Hello JavaScript
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Hello JavaScript',
  '👋 <b>Welcome!</b><br><br>Let''s start with something very simple.<br>
  Use <code>console.log()</code> to print a message.<br><br>
  ✅ <b>Task:</b> Print <code>Hello, JavaScript!</code><br><br>
  <code>console.log("Hello, JavaScript!");</code>',
  '',
  'Hello, JavaScript!',
  1,
  7, 
  1
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points)
VALUES (last_insert_rowid(), '', 'Hello, JavaScript!', 1);

-- Exercise 2: Emoji Logger
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id)
VALUES (
  'Emoji Logger',
  '😀 <b>Fun with Emojis!</b><br><br>
  Use <code>console.log()</code> to print a line of emojis.<br>
  ✅ <b>Task:</b> Print <code>😀🎉🚀</code>',
  '',
  '😀🎉🚀',
  2,
  7,
  2
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points)
VALUES (last_insert_rowid(), '', '😀🎉🚀', 1);

-- Exercise 3: Print Mood
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Print your Mood',
  '😎 <b>Use a Variable</b><br><br>
  Set a variable: <code>let mood = "Happy";</code><br>
  Then print it using <code>console.log(mood);</code>',
  '',
  'Happy',
  2,
  7,
  3
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points)
VALUES (last_insert_rowid(), '', 'Happy', 1);

-- Exercise 4: Add Two Numbers
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Add Two Numbers',
  '➕ <b>Let''s do some math</b><br><br>
  Use two variables: <code>let a = 3, b = 5;</code><br>
  Print their sum: <code>console.log(a + b);</code>',
  '',
  '8',
  3,
  7,
  4
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points)
VALUES (last_insert_rowid(), '', '8', 1);

-- Exercise 5: Multiply
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Multiply Two Numbers',
  '✖️ <b>More Math</b><br><br>
  Multiply 4 and 6 using variables and print the result.',
  '',
  '24',
  4,
  7,
  5
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points)
VALUES (last_insert_rowid(), '', '24', 1);

-- Exercise 6: Join Text and Variables
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Join Text and Variables',
  '🔡 <b>Combine Text + Variable</b><br><br>
  Create a variable <code>name = "Jamie"</code><br>
  Print: <code>Hello, my name is Jamie</code><br>
  ✅ Use: <code>console.log("Hello, my name is " + name);</code>',
  '',
  'Hello, my name is Jamie',
  3,
  7,
  6
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points)
VALUES (last_insert_rowid(), '', 'Hello, my name is Jamie', 2);

-- Exercise 7: Greeting with Input
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Greeting with Input',
  '<b>🤝 Greet the User!</b><br /><br />
Let''s take your first step into interactive JavaScript!<br /><br />

We''ll use the built-in <code>readline</code> module to get input from the user in the terminal.<br /><br />

✅ <b>Task:</b><br />
Ask the user: <code>What is your name?</code><br />
Then greet them with: <code>Hello, [name]!</code><br /><br />

✅ <b>Here''s how:</b><br />
Use the following code to achieve this:<br /><br />

<pre><code>const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question("What is your name? ", name => {
  console.log("Hello, " + name + "!");
  readline.close();
});
</code></pre>

<br />
👆 This code does the following:<br />
• Creates a `readline` interface to read from standard input/output.<br />
• Prompts the user with the question <code>"What is your name?"</code><br />
• Waits for the user to enter their name.<br />
• Prints <code>Hello, [name]!</code> using <code>console.log()</code><br />
• Closes the interface when done.<br /><br />

🎉 That''s it! You''re now interacting with users through the terminal.
',
  'Sam',
  'Hello, Sam!',
  6,
  7,
  7
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), 'Sam', 'Hello, Sam!', 3),
(last_insert_rowid(), 'Alex', 'Hello, Alex!', 3);

-- Exercise 8: Combine Words
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Combine Words',
  '🔤 <b>Combine Strings</b><br><br>
  Create <code>word1 = "Good"</code> and <code>word2 = "Morning"</code><br>
  Then print: <code>Good Morning</code>',
  '',
  'Good Morning',
  5,
  7,
  8
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points)
VALUES (last_insert_rowid(), '', 'Good Morning', 4);

-- Exercise 9: Favorite Color
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Favorite Color',
  '🎨 <b>User input: color</b><br><br>
  Ask the user: What is your favorite color?<br>
  Then print: <code>Your favorite color is blue</code><br><br>
  ✅ Replace "blue" with what they typed.',
  'blue',
  'Your favorite color is blue',
  7,
  7,
  9
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), 'blue', 'Your favorite color is blue', 4),
(last_insert_rowid(), 'red', 'Your favorite color is red', 3);

-- Exercise 10: Repeat After Me
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Repeat After Me',
  '🔁 <b>Echo</b><br><br>
  Read one line of text from the user and print it back.
  ✅ Use readline and simply:
  <code>console.log(line);</code>',
  'I love JavaScript!',
  'I love JavaScript!',
  6,
  7,
  10
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), 'I love JavaScript!', 'I love JavaScript!', 3),
(last_insert_rowid(), 'Node.js is fun', 'Node.js is fun', 3);

-- Exercise 11: Make a Sentence
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Make a Sentence',
  '✍️ <b>Make a sentence with 3 words</b><br><br>
  Create variables: <code>"I", "love", "coding"</code><br>
  ✅ Print: <code>I love coding</code>',
  '',
  'I love coding',
  8,
  7,
  11
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '', 'I love coding', 4);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Are You an Adult?',
  '🎓 <b>Age Check with if</b><br><br>
  Read a number (your age) from the user and print:<br>
  <code>You are an adult</code> – if age ≥ 18<br>
  Otherwise print:<br>
  <code>You are not an adult</code><br><br>
  ✅ Tip:<br>
  <code>if (age >= 18) { console.log("You are an adult"); }</n> else { console.log("You are not an adult"); }</code>',
  '20',
  'You are an adult',
  8,
  7,
  12
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '20', 'You are an adult', 4),
(last_insert_rowid(), '16', 'You are not an adult', 4);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Is It Raining?',
  '⛱️ <b>Simple if/else with text</b><br><br>
  Ask: “Is it raining?”<br>
  - If input is <code>yes</code> → print <code>Take an umbrella!</code><br>
  - If input is <code>no</code> → print <code>Enjoy your day!</code><br><br>
  ✅ Tip: Compare strings exactly:<br>
  <code>if (answer === "yes") { ... }</code>',
  'yes',
  'Take an umbrella!',
  6,
  7,
  13
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), 'yes', 'Take an umbrella!', 3),
(last_insert_rowid(), 'no', 'Enjoy your day!', 3);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Guess My Number',
  '🎲 <b>Number Guessing</b><br><br>
  My secret number is <b>7</b>. Read one number from the user:<br>
  - If guess is <code>7</code> → print <code>Correct!</code><br>
  - Else → print <code>Wrong number</code><br><br>
  ✅ Tip: Use strict equality:<br>
  <code>if (guess === 7)</code>',
  '7',
  'Correct!',
  7,
  7,
  14
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '7', 'Correct!', 4),
(last_insert_rowid(), '5', 'Wrong number', 3);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Check Password',
  '🔐 <b>Simple password check</b><br><br>
  The secret password is <code>secret123</code>.<br>
  Read user input:<br>
  - If correct → print <code>Access granted</code><br>
  - Else → print <code>Access denied</code><br><br>
  ✅ Tip: Use strict compare:<br>
  <code>if (pass === "secret123") { ... }</code>',
  'secret123',
  'Access granted',
  8,
  7,
  15
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), 'secret123', 'Access granted', 4),
(last_insert_rowid(), 'wrong', 'Access denied', 4);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Number is Positive',
  '➕ <b>Check Positive/Negative/Zero</b><br><br>
  Read a number from the user:<br>
  - If > 0 → <code>Positive</code><br>
  - If = 0 → <code>Zero</code><br>
  - If < 0 → <code>Negative</code><br><br>
  ✅ Tip: Use nested if:<br>
  <code>if (n > 0) ... else if (n === 0) ... else ...</code>',
  '-4',
  'Negative',
  9,
  7,
  16
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '5', 'Positive', 3),
(last_insert_rowid(), '0', 'Zero', 3),
(last_insert_rowid(), '-3', 'Negative', 3);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Even or Odd',
  '🔢 <b>Check if a number is even or odd</b><br><br>
  Read a number from the user:<br>
  - If (n % 2 === 0) → print <code>Even</code><br>
  - Else → <code>Odd</code><br><br>
  ✅ Tip: Use the modulo operator % to test evenness.',
  '7',
  'Odd',
  10,
  7,
  17
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '8', 'Even', 5),
(last_insert_rowid(), '9', 'Odd', 5);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Maximum of Two',
  '➡️ <b>Find the larger of two numbers</b><br><br>
  Read two numbers on one line (e.g. <code>8 15</code>).<br>
  Print the larger number.<br><br>
  ✅ Tip: Split input and compare:<br>
  <code>const [a, b] = line.trim().split('' '').map(Number);</code><br>
  <code>console.log(a > b ? a : b);</code>',
  '8 15',
  '15',
  12,
  7,
  18
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '8 15', '15', 6),
(last_insert_rowid(), '10 3', '10', 6);

-- CATEGORY 5 (Exercises)
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Say Hello Function',
  '👋 <b>Define a Function</b><br><br>
  Create a function called <code>sayHello()</code> that prints <code>Hello!</code><br><br>
  ✅ Call the function after defining it.',
  '',
  'Hello!',
  5,
  8,
  1
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '', 'Hello!', 2);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Greet by Name',
  '😃 <b>Function with Parameter</b><br><br>
  Define a function: <code>greet(name)</code><br>
  Print: <code>Hello, [name]!</code><br><br>
  ✅ Example: <code>greet("Sam") → Hello, Sam!</code>',
  'Sam',
  'Hello, Sam!',
  6,
  8,
  2
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), 'Sam', 'Hello, Sam!', 3),
(last_insert_rowid(), 'Alex', 'Hello, Alex!', 3);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Square a Number',
  '🔢 <b>Return a Value</b><br><br>
  Write a function <code>square(n)</code> that returns the square of the number.<br><br>
  ✅ Example: <code>square(5)</code> should return <code>25</code>.',
  '5',
  '25',
  7,
  8,
  3
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '5', '25', 3),
(last_insert_rowid(), '9', '81', 4);


INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Absolute Value',
  '➖ <b>Use Math</b><br><br>
  Create a function <code>abs(n)</code> that returns the absolute value of a number.<br>
  ✅ Example: <code>abs(-4)</code> → <code>4</code>',
  '-4',
  '4',
  8,
  8,
  4
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '-4', '4', 4),
(last_insert_rowid(), '5', '5', 3);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Is Positive?',
  '🔍 <b>Boolean Check</b><br><br>
  Write a function <code>isPositive(n)</code> that returns <code>true</code> if the number is positive, else <code>false</code>',
  '3',
  'true',
  7,
  8,
  5
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '3', 'true', 3),
(last_insert_rowid(), '-2', 'false', 4);

INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id) VALUES (
  'Minimum of Two',
  '📉 <b>Return the smaller number</b><br><br>
  Write a function <code>min(a, b)</code> that returns the smallest of two numbers.',
  '8 3',
  '3',
  9,
  8,
  6
);

INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
(last_insert_rowid(), '8 3', '3', 4),
(last_insert_rowid(), '2 2', '2', 4);


-- QUEST Exercise: Team Decision
INSERT INTO exercises (title, description, input, expected_output, max_score, category_id, sub_id)
VALUES (
  'Team Decision',
  '👨‍💻 <b>Team Strategy</b><br><br>
Three friends – Petya, Vasya, and Tonya – are solving problems.<br>
They will implement a problem only if <b>at least two of them are sure</b> about its solution.<br><br>

🧠 <b>Input:</b><br>
• First line: <code>n</code> (number of problems)<br>
• Next <code>n</code> lines: each has 3 values (0 or 1), showing if Petya, Vasya, Tonya are sure<br><br>

✅ <b>Output:</b><br>
Print the number of problems they will implement.<br><br>

<pre><code>Example:
Input:
3
1 1 0
1 1 1
1 0 0

Output:
2</code></pre>

⛏️ Tip: Use <code>readline</code> to read input and a counter to count problems with 2 or more ''sure'' friends.
',
  '3\n1 1 0\n1 1 1\n1 0 0',
  '2',
  100,
  9,
  1
);


INSERT INTO exercise_tests (exercise_id, input, expected_output, points) VALUES
  (last_insert_rowid(), '3\n1 1 0\n1 1 1\n1 0 0', '2', 6),
  (last_insert_rowid(), '2\n1 0 0\n0 1 1', '1', 6),
  (last_insert_rowid(), '4\n0 0 0\n1 1 0\n0 1 1\n1 0 1', '3', 6);
