-- Add difficulty field to exams table (if not exists)
ALTER TABLE exams ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard'));

-- Update existing exam with difficulty
UPDATE exams SET difficulty = 'Medium' WHERE difficulty IS NULL;

-- Insert a sample exam attempt for testing (replace user_id with your actual user ID)
-- First, check what user IDs exist
SELECT id, email, role FROM users;

-- Example: Insert exam attempt for user ID 3 (change this to match your user)
-- Uncomment and modify the user_id below after checking available users
/*
INSERT INTO user_exam_attempts 
  (user_id, exam_id, score, total_questions, correct_answers, time_spent, passed, started_at, completed_at, answers)
VALUES 
  (3, 1, 85, 10, 8, 1800, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', '{"1":"B","2":"A","3":"B","4":"B","5":"C","6":"C","7":"B","8":"B","9":"A","10":"C"}'),
  (3, 1, 90, 10, 9, 1500, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', '{"1":"B","2":"A","3":"B","4":"B","5":"C","6":"C","7":"B","8":"B","9":"C","10":"C"}'),
  (3, 1, 75, 10, 7, 2100, true, NOW(), NOW(), '{"1":"B","2":"A","3":"A","4":"B","5":"C","6":"A","7":"B","8":"B","9":"C","10":"C"}');
*/

-- Insert user progress data for testing
/*
INSERT INTO user_progress 
  (user_id, subject, topic, questions_attempted, questions_correct, total_time_spent, last_practiced)
VALUES
  (3, 'Mathematics', 'Algebra', 30, 25, 45, NOW() - INTERVAL '1 day'),
  (3, 'Mathematics', 'Geometry', 20, 16, 30, NOW() - INTERVAL '2 days'),
  (3, 'Reading', 'Vocabulary', 25, 18, 35, NOW() - INTERVAL '3 days'),
  (3, 'Reading', 'Comprehension', 15, 12, 25, NOW() - INTERVAL '4 days')
ON CONFLICT (user_id, subject, topic) 
DO UPDATE SET 
  questions_attempted = user_progress.questions_attempted + EXCLUDED.questions_attempted,
  questions_correct = user_progress.questions_correct + EXCLUDED.questions_correct,
  total_time_spent = user_progress.total_time_spent + EXCLUDED.total_time_spent,
  last_practiced = CURRENT_TIMESTAMP;
*/

-- View all users to find your user ID
SELECT id, name, email, role FROM users ORDER BY created_at DESC;

-- View all exams
SELECT id, title, subject, difficulty, is_active FROM exams;

-- After you know your user_id, uncomment and run the INSERT statements above
-- Replace (3, ...) with your actual user_id


