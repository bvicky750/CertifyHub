-- Online Course Certification Portal (CertifyHub)
-- Seed Data

USE online_course_portal;

-- Disable foreign key checks for clean re-seeding
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE certificates;
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE questions;
TRUNCATE TABLE quizzes;
TRUNCATE TABLE lesson_progress;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE lessons;
TRUNCATE TABLE modules;
TRUNCATE TABLE courses;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Seed Users (Admin & Student)
-- Passwords:
-- Admin: Admin@123 -> $2a$10$7yuz5MESJw1haFDCez/UvO2WtcRvVJZkH2kildsxOH0jfnGMRt3Sm
-- Student: Student@123 -> $2a$10$I001nV7.yF506U6W6V6FfuyHdMsWXhYPK79AfhnOsZWGtC0Xh2D0K
INSERT INTO users (id, name, email, password, role, profile_image) VALUES
(1, 'System Administrator', 'admin@example.com', '$2a$10$7yuz5MESJw1haFDCez/UvO2WtcRvVJZkH2kildsxOH0jfnGMRt3Sm', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'),
(2, 'Alex Morgan', 'student@example.com', '$2a$10$I001nV7.yF506U6W6V6FfuyHdMsWXhYPK79AfhnOsZWGtC0Xh2D0K', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

-- 2. Seed Courses
INSERT INTO courses (id, title, slug, description, short_description, instructor_name, category, level, duration, thumbnail, status, created_by) VALUES
(1, 'Full Stack Web Development', 'full-stack-web-development', 
'Master modern full-stack web application development from scratch. This comprehensive curriculum takes you through semantic HTML5, modern CSS3 layout techniques, modern JavaScript (ES6+), React client-side development, Node.js REST API engineering with Express, and persistent relational data storage with MySQL.', 
'Learn front-end and back-end web development with React, Node.js, Express, and MySQL.', 
'Dr. Angela Vance', 'Web Development', 'Beginner', '12 Weeks', 
'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80', 'published', 1),

(2, 'Python Programming Fundamentals', 'python-programming-fundamentals', 
'Begin your coding journey with one of the worlds most versatile and readable programming languages. Learn syntax, variables, conditional logic, loops, functions, data structures like lists and dictionaries, object-oriented concepts, and clean coding best practices.', 
'A comprehensive introduction to Python syntax, data structures, and object-oriented programming.', 
'Prof. Michael Chang', 'Programming', 'Beginner', '8 Weeks', 
'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80', 'published', 1),

(3, 'Database Management with MySQL', 'database-management-mysql', 
'Demystify relational databases and learn how data is structured, indexed, and queried in high-scale production systems. Master DDL, DML, complex JOIN operations, database normalization (1NF to BCNF), indexing strategies, and ACID transaction guarantees.', 
'Master relational schema design, SQL querying, indexing, and database administration.', 
'Sarah Jenkins, M.Sc.', 'Database', 'Intermediate', '6 Weeks', 
'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80', 'published', 1),

(4, 'Data Structures & Algorithms', 'data-structures-algorithms', 
'Crack technical problem solving and software engineering interviews. Understand computational complexity using Big-O notation, and implement arrays, linked lists, stacks, queues, hash maps, binary trees, graphs, and dynamic programming patterns.', 
'Strengthen your algorithmic problem solving skills and prepare for technical interviews.', 
'David Kumar', 'Programming', 'Intermediate', '10 Weeks', 
'https://images.unsplash.com/photo-1516116211227-bbc063467bf4?auto=format&fit=crop&w=800&q=80', 'published', 1),

(5, 'Introduction to Machine Learning', 'intro-machine-learning', 
'Explore the core algorithms driving artificial intelligence. Learn supervised vs unsupervised learning, linear regression, logistic regression, decision trees, neural network fundamentals, feature engineering, and model evaluation using Python and scikit-learn.', 
'Understand machine learning algorithms, model training, and predictive analysis.', 
'Dr. Elena Rostova', 'Data Science', 'Advanced', '10 Weeks', 
'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', 'published', 1);

-- 3. Seed Modules (Course 1: Full Stack Web Development)
INSERT INTO modules (id, course_id, title, description, order_number) VALUES
(1, 1, 'HTML5 & Modern Web Foundations', 'Structural markup, accessibility, and modern semantic conventions.', 1),
(2, 1, 'Modern CSS & Responsive Design', 'Flexbox, CSS Grid, and responsive mobile-first UI development.', 2),
(3, 1, 'JavaScript ES6+ Core Concepts', 'Asynchronous JS, DOM manipulation, promises, and modern syntax.', 3),
(4, 1, 'Backend Engineering with Node & Express', 'RESTful API design, middleware patterns, and routing.', 4);

-- 4. Seed Lessons (Course 1 Modules)
INSERT INTO lessons (id, module_id, title, description, video_url, resource_url, duration, order_number) VALUES
(1, 1, 'Web Architecture & Semantic HTML5', 'Overview of client-server request cycles and semantic HTML tags.', 'https://www.youtube.com/embed/kUMe1FH4CHE', 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics', '20 mins', 1),
(2, 1, 'Accessible Forms and Input Controls', 'Creating validated forms with accessible labels and keyboard accessibility.', 'https://www.youtube.com/embed/fNcJuPIZ2WE', 'https://www.w3.org/WAI/tutorials/forms/', '25 mins', 2),
(3, 2, 'Mastering CSS Flexbox Layout', 'Parent container properties, alignment, justification, and dynamic spacing.', 'https://www.youtube.com/embed/fYq5PXgSsbE', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', '30 mins', 1),
(4, 2, 'CSS Grid Layout Architecture', 'Two-dimensional grid systems, grid areas, and responsive templates.', 'https://www.youtube.com/embed/9zBsdzdE4sM', 'https://css-tricks.com/snippets/css/complete-guide-grid/', '35 mins', 2),
(5, 3, 'ES6 Syntax, Arrow Functions & Destructuring', 'Modern JavaScript fundamentals that enhance readability and efficiency.', 'https://www.youtube.com/embed/NCwa_xi0Uuc', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', '30 mins', 1),
(6, 3, 'Asynchronous JavaScript & Fetch API', 'Promises, async/await, and handling API responses without blocking.', 'https://www.youtube.com/embed/PoRJizFvM7s', 'https://javascript.info/async-await', '40 mins', 2),
(7, 4, 'Building RESTful APIs with Express', 'Routing, request params, query strings, and JSON request bodies.', 'https://www.youtube.com/embed/pKd0Rpw7O48', 'https://expressjs.com/en/starter/basic-routing.html', '45 mins', 1),
(8, 4, 'JWT Authentication & Security Middleware', 'Stateless token issuance, verification middleware, and password hashing.', 'https://www.youtube.com/embed/7Q17ubqL20A', 'https://jwt.io/introduction', '40 mins', 2);

-- Seed Modules & Lessons for Course 2 (Python Programming Fundamentals)
INSERT INTO modules (id, course_id, title, description, order_number) VALUES
(5, 2, 'Python Syntax and Variables', 'Setting up the Python runtime and writing initial programs.', 1),
(6, 2, 'Data Structures & Functions', 'Working with lists, dictionaries, tuples, and modular functions.', 2);

INSERT INTO lessons (id, module_id, title, description, video_url, resource_url, duration, order_number) VALUES
(9, 5, 'Introduction to Python & Data Types', 'Numbers, strings, booleans, and dynamic typing in Python.', 'https://www.youtube.com/embed/_uQrJ0TkZlc', 'https://docs.python.org/3/tutorial/introduction.html', '25 mins', 1),
(10, 5, 'Conditional Statements & Loops', 'If-elif-else statements, for loops, and while loops.', 'https://www.youtube.com/embed/rfscVS0vtbw', 'https://docs.python.org/3/tutorial/controlflow.html', '30 mins', 2),
(11, 6, 'Lists, Tuples and Dictionaries', 'Collection manipulation, indexing, slicing, and key-value maps.', 'https://www.youtube.com/embed/W8KRzm-HUcc', 'https://docs.python.org/3/tutorial/datastructures.html', '35 mins', 1),
(12, 6, 'Writing Clean Modular Functions', 'Function definitions, arguments, return types, and docstrings.', 'https://www.youtube.com/embed/9Os0o3wzS_I', 'https://peps.python.org/pep-0008/', '30 mins', 2);

-- Seed Modules & Lessons for Course 3 (Database Management with MySQL)
INSERT INTO modules (id, course_id, title, description, order_number) VALUES
(7, 3, 'Relational Modeling & DDL', 'Entities, relationships, primary keys, and foreign keys.', 1),
(8, 3, 'Complex SQL Queries & Joins', 'INNER, LEFT, RIGHT, and FULL OUTER joins, subqueries, and grouping.', 2);

INSERT INTO lessons (id, module_id, title, description, video_url, resource_url, duration, order_number) VALUES
(13, 7, 'Database Normalization from 1NF to 3NF', 'Eliminating data redundancy and maintaining database integrity.', 'https://www.youtube.com/embed/UrYLYV7WSHM', 'https://dev.mysql.com/doc/refman/8.0/en/', '35 mins', 1),
(14, 7, 'Creating Tables, Constraints & Indexes', 'Primary keys, foreign keys with CASCADE, unique indexes, and B-trees.', 'https://www.youtube.com/embed/7S_tz1z_5bA', 'https://dev.mysql.com/doc/refman/8.0/en/create-table.html', '40 mins', 2),
(15, 8, 'Mastering Multi-Table SQL Joins', 'Connecting tables efficiently using relational keys.', 'https://www.youtube.com/embed/0r1S3P26bH0', 'https://dev.mysql.com/doc/refman/8.0/en/join.html', '45 mins', 1);

-- Seed Modules & Lessons for Course 4 (Data Structures & Algorithms)
INSERT INTO modules (id, course_id, title, description, order_number) VALUES
(9, 4, 'Algorithm Analysis & Linear Structures', 'Big-O notation, arrays, linked lists, stacks, and queues.', 1);

INSERT INTO lessons (id, module_id, title, description, video_url, resource_url, duration, order_number) VALUES
(16, 9, 'Time and Space Complexity (Big-O)', 'Asymptotic analysis, worst-case, average-case, and best-case performance.', 'https://www.youtube.com/embed/8hly31xKli0', 'https://www.bigocheatsheet.com/', '30 mins', 1),
(17, 9, 'Linked Lists vs Dynamic Arrays', 'Memory layouts, node pointers, insertion, and traversal complexity.', 'https://www.youtube.com/embed/WwfhLC16bis', 'https://en.wikipedia.org/wiki/Linked_list', '35 mins', 2);

-- Seed Modules & Lessons for Course 5 (Introduction to Machine Learning)
INSERT INTO modules (id, course_id, title, description, order_number) VALUES
(10, 5, 'Supervised Learning Foundations', 'Regression, classification, and model performance metrics.', 1);

INSERT INTO lessons (id, module_id, title, description, video_url, resource_url, duration, order_number) VALUES
(18, 10, 'Linear and Logistic Regression', 'Formulating cost functions, gradient descent, and decision boundaries.', 'https://www.youtube.com/embed/i_LwzRVP7bg', 'https://scikit-learn.org/stable/supervised_learning.html', '40 mins', 1),
(19, 10, 'Model Evaluation & Overfitting', 'Training/validation/test splits, cross-validation, and bias-variance tradeoff.', 'https://www.youtube.com/embed/EuBBz3bI-aA', 'https://scikit-learn.org/stable/modules/model_evaluation.html', '35 mins', 2);

-- 5. Seed Quizzes
INSERT INTO quizzes (id, course_id, title, description, passing_score) VALUES
(1, 1, 'Full Stack Web Development Certification Assessment', 'Demonstrate your mastery of frontend, backend, REST API, and database concepts.', 60),
(2, 2, 'Python Programming Fundamentals Quiz', 'Verify your knowledge of core Python syntax, collections, and control flow.', 60),
(3, 3, 'MySQL Relational Database Mastery Test', 'Comprehensive assessment covering SQL queries, indexes, normalization, and ACID.', 60),
(4, 4, 'Data Structures & Complexity Exam', 'Test your understanding of Big-O complexity and linear data structures.', 60),
(5, 5, 'Machine Learning Foundations Assessment', 'Assess your grasp of regression, classification, and model evaluation.', 60);

-- 6. Seed Questions (Quiz 1: Full Stack Web Development)
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_option, marks) VALUES
(1, 1, 'Which HTML5 element is most appropriate for high-level standalone articles or blog posts?', '<section>', '<article>', '<div>', '<aside>', 'B', 10),
(2, 1, 'In CSS Flexbox, which property defines the main axis along which flex items are placed?', 'align-items', 'justify-content', 'flex-direction', 'flex-wrap', 'C', 10),
(3, 1, 'What is the primary benefit of using async/await syntax over traditional callback functions in JavaScript?', 'It speeds up code execution by multithreading', 'It writes asynchronous code in a readable, sequential synchronous-like style', 'It prevents all network errors automatically', 'It eliminates the need for HTTP headers', 'B', 10),
(4, 1, 'Which HTTP method should be used in a RESTful API to modify an existing resource partially?', 'GET', 'POST', 'PATCH', 'DELETE', 'C', 10),
(5, 1, 'Where should sensitive JWT secret keys and database credentials be stored in an Express server?', 'Hardcoded in server.js', 'In an environment file (.env) excluded from version control', 'In client localStorage', 'In a public database table', 'B', 10),
(6, 1, 'What does the "C" in ACID database transactions represent?', 'Concurrency', 'Completeness', 'Consistency', 'Cascade', 'C', 10);

-- Questions for Quiz 2 (Python)
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_option, marks) VALUES
(7, 2, 'What data structure in Python is immutable and ordered?', 'List', 'Tuple', 'Set', 'Dictionary', 'B', 10),
(8, 2, 'How do you define a function in Python?', 'function myFunc()', 'def my_func():', 'func my_func():', 'def: my_func()', 'B', 10),
(9, 2, 'What will be the output of: print(type([1, 2, 3]))?', "<class 'set'>", "<class 'tuple'>", "<class 'list'>", "<class 'array'>", 'C', 10);

-- Questions for Quiz 3 (MySQL)
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_option, marks) VALUES
(10, 3, 'Which normal form eliminates partial functional dependencies on a composite primary key?', 'First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)', 'B', 10),
(11, 3, 'Which SQL clause is used to filter records after aggregation with GROUP BY?', 'WHERE', 'HAVING', 'ORDER BY', 'LIMIT', 'B', 10),
(12, 3, 'What does the ON DELETE CASCADE foreign key constraint ensure?', 'Prevents deletion of parent rows', 'Deletes child rows automatically when the parent row is deleted', 'Sets child foreign key to NULL', 'Throws a syntax error on delete', 'B', 10);

-- Questions for Quiz 4 (DSA)
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_option, marks) VALUES
(13, 4, 'What is the worst-case time complexity of accessing an element by index in a standard array?', 'O(1)', 'O(n)', 'O(log n)', 'O(n^2)', 'A', 10),
(14, 4, 'Which data structure follows the First-In, First-Out (FIFO) principle?', 'Stack', 'Queue', 'Binary Search Tree', 'Heap', 'B', 10);

-- Questions for Quiz 5 (ML)
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_option, marks) VALUES
(15, 5, 'Which metric is best suited for evaluating an imbalanced classification model?', 'Accuracy', 'F1-Score / Precision-Recall', 'Mean Squared Error', 'R-squared', 'B', 10),
(16, 5, 'What occurs when a machine learning model learns noise in the training data and fails to generalize?', 'Underfitting', 'Overfitting', 'High Bias', 'Dimensionality Reduction', 'B', 10);

-- 7. Seed Sample Enrollment, Progress, and Certificate for student (Course 2: Python)
-- This ensures the student has an immediately verifiable certificate to view and verify out-of-the-box!
INSERT INTO enrollments (id, user_id, course_id, enrolled_at, completed_at, status) VALUES
(1, 2, 2, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 'completed');

INSERT INTO lesson_progress (enrollment_id, lesson_id, completed, completed_at) VALUES
(1, 9, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 10, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 11, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 12, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total_marks, percentage, passed, attempted_at) VALUES
(1, 2, 2, 30, 30, 100.00, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO certificates (id, certificate_number, user_id, course_id, issue_date, certificate_url, verification_code) VALUES
(1, 'CERT-2026-000101', 2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), '/certificates/CERT-2026-000101.pdf', 'VERIFY-PY-89472');

-- Also seed an active enrollment for Student in Course 1 (Full Stack Web Development) with 2 lessons completed so progress is visible!
INSERT INTO enrollments (id, user_id, course_id, enrolled_at, completed_at, status) VALUES
(2, 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'active');

INSERT INTO lesson_progress (enrollment_id, lesson_id, completed, completed_at) VALUES
(2, 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));
