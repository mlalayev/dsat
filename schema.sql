-- Example Database Schema for PrepPulse Application
-- Run this in pgAdmin 4 Query Tool or psql to create your initial tables

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- For authentication
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')), -- User role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Study Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    duration INTEGER, -- in minutes
    score INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- ============================================
-- Exams Table
-- ============================================
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    total_questions INTEGER NOT NULL,
    passing_score INTEGER NOT NULL, -- percentage required to pass
    subject VARCHAR(100),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Questions Table (for practice questions and exams)
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50), -- easy, medium, hard
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    option_d TEXT,
    correct_answer CHAR(1) NOT NULL, -- 'A', 'B', 'C', or 'D'
    explanation TEXT,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- User Exam Attempts Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_exam_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_spent INTEGER, -- in seconds
    passed BOOLEAN DEFAULT false,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    answers JSONB -- Store user answers as JSON
);

-- ============================================
-- User Question Responses Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_question_responses (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER REFERENCES user_exam_attempts(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    user_answer CHAR(1), -- 'A', 'B', 'C', or 'D'
    is_correct BOOLEAN DEFAULT false,
    time_spent INTEGER, -- in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- User Progress Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    last_practiced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject, topic)
);

-- ============================================
-- Indexes for Better Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject_topic ON questions(subject, topic);
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_is_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_user_exam_attempts_user_id ON user_exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_attempts_exam_id ON user_exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_user_question_responses_attempt_id ON user_question_responses(attempt_id);

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Note: Use the signup API or create-admin.js script to create users with proper password hashing
-- Sample users removed because password_hash is now required

-- Insert sample questions
INSERT INTO questions (subject, topic, difficulty, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES 
    ('Mathematics', 'Algebra', 'easy', 'What is 2 + 2?', '3', '4', '5', '6', 'B', 'Basic addition: 2 + 2 = 4'),
    ('Mathematics', 'Algebra', 'medium', 'Solve for x: 2x + 5 = 15', 'x = 3', 'x = 5', 'x = 7', 'x = 10', 'B', 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5'),
    ('Physics', 'Mechanics', 'medium', 'What is Newton''s first law?', 'F = ma', 'Objects in motion stay in motion unless acted upon', 'E = mc²', 'For every action there is an equal and opposite reaction', 'B', 'Newton''s first law is the law of inertia'),
    ('Chemistry', 'Periodic Table', 'easy', 'What is the chemical symbol for water?', 'H2O', 'CO2', 'O2', 'N2', 'A', 'Water is composed of 2 hydrogen atoms and 1 oxygen atom')
ON CONFLICT DO NOTHING;

-- Sample study sessions can be added after users are created through the app

-- ============================================
-- Useful Queries (for reference)
-- ============================================

-- Get user with their total study time
-- SELECT u.name, SUM(ss.duration) as total_minutes
-- FROM users u
-- LEFT JOIN study_sessions ss ON u.id = ss.user_id
-- GROUP BY u.id, u.name;

-- Get user's performance by subject
-- SELECT 
--     subject,
--     COUNT(*) as sessions,
--     AVG(score) as avg_score,
--     SUM(duration) as total_time
-- FROM study_sessions
-- WHERE user_id = 1
-- GROUP BY subject;

-- Get questions by difficulty for a specific topic
-- SELECT * FROM questions
-- WHERE subject = 'Mathematics' AND topic = 'Algebra'
-- ORDER BY difficulty, id;

-- Update user progress after a study session
-- INSERT INTO user_progress (user_id, subject, topic, questions_attempted, questions_correct, total_time_spent)
-- VALUES (1, 'Mathematics', 'Algebra', 10, 8, 30)
-- ON CONFLICT (user_id, subject, topic) 
-- DO UPDATE SET 
--     questions_attempted = user_progress.questions_attempted + EXCLUDED.questions_attempted,
--     questions_correct = user_progress.questions_correct + EXCLUDED.questions_correct,
--     total_time_spent = user_progress.total_time_spent + EXCLUDED.total_time_spent,
--     last_practiced = CURRENT_TIMESTAMP;

-- ============================================
-- Verification Queries
-- ============================================

-- Check if tables were created successfully
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- Count records in each table
-- SELECT 'users' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'questions', COUNT(*) FROM questions
-- UNION ALL
-- SELECT 'study_sessions', COUNT(*) FROM study_sessions
-- UNION ALL
-- SELECT 'user_progress', COUNT(*) FROM user_progress;

