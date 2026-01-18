// Test Dashboard Data - Adds sample data for testing dashboards
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function addTestData() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'preppulse_db',
  });

  try {
    console.log('📊 Adding test dashboard data...\n');

    // Add difficulty column to exams if it doesn't exist
    await pool.query(`
      ALTER TABLE exams 
      ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'Medium' 
      CHECK (difficulty IN ('Easy', 'Medium', 'Hard'))
    `);
    
    await pool.query(`UPDATE exams SET difficulty = 'Medium' WHERE difficulty IS NULL`);
    console.log('✅ Updated exams table with difficulty field\n');

    // Get a non-admin user to add test data for
    const userResult = await pool.query(
      "SELECT id, email FROM users WHERE role = 'user' ORDER BY created_at DESC LIMIT 1"
    );

    if (userResult.rows.length === 0) {
      console.log('⚠️  No regular users found. Please sign up at /signup first.');
      await pool.end();
      process.exit(0);
    }

    const testUser = userResult.rows[0];
    console.log(`Using test user: ${testUser.email} (ID: ${testUser.id})`);

    // Get exam ID
    const examResult = await pool.query('SELECT id FROM exams LIMIT 1');
    if (examResult.rows.length === 0) {
      console.log('⚠️  No exams found. Run add-sample-exam.js first.');
      await pool.end();
      process.exit(0);
    }

    const examId = examResult.rows[0].id;

    // Check if user already has attempts
    const existingAttempts = await pool.query(
      'SELECT COUNT(*) as count FROM user_exam_attempts WHERE user_id = $1',
      [testUser.id]
    );

    if (parseInt(existingAttempts.rows[0].count) > 0) {
      console.log(`\n✅ User already has ${existingAttempts.rows[0].count} exam attempts.`);
      console.log('   Dashboard should already show data.\n');
    } else {
      // Add sample exam attempts
      console.log('\nAdding sample exam attempts...');
      
      const attempts = [
        { score: 85, correct: 8, time: 1800, days_ago: 5 },
        { score: 78, correct: 7, time: 2100, days_ago: 3 },
        { score: 90, correct: 9, time: 1500, days_ago: 1 },
      ];

      for (const attempt of attempts) {
        await pool.query(
          `INSERT INTO user_exam_attempts 
           (user_id, exam_id, score, total_questions, correct_answers, time_spent, passed, started_at, completed_at, answers)
           VALUES ($1, $2, $3, 10, $4, $5, $6, NOW() - INTERVAL '${attempt.days_ago} days', NOW() - INTERVAL '${attempt.days_ago} days', '{}')`,
          [testUser.id, examId, attempt.score, attempt.correct, attempt.time, attempt.score >= 70]
        );
        console.log(`   ✓ Added attempt: ${attempt.score}% (${attempt.days_ago} days ago)`);
      }

      // Add sample user progress
      console.log('\nAdding sample topic progress...');
      
      const progressData = [
        { subject: 'Mathematics', topic: 'Algebra', attempted: 30, correct: 25, time: 45 },
        { subject: 'Mathematics', topic: 'Geometry', attempted: 20, correct: 16, time: 30 },
        { subject: 'Reading', topic: 'Vocabulary', attempted: 25, correct: 18, time: 35 },
        { subject: 'Reading', topic: 'Comprehension', attempted: 15, correct: 12, time: 25 },
      ];

      for (const progress of progressData) {
        await pool.query(
          `INSERT INTO user_progress 
           (user_id, subject, topic, questions_attempted, questions_correct, total_time_spent, last_practiced)
           VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '1 day')
           ON CONFLICT (user_id, subject, topic) DO NOTHING`,
          [testUser.id, progress.subject, progress.topic, progress.attempted, progress.correct, progress.time]
        );
        console.log(`   ✓ Added progress: ${progress.subject} - ${progress.topic}`);
      }

      console.log('\n✅ Test data added successfully!');
    }

    console.log('\n📌 Dashboard Testing:');
    console.log(`   1. Login with: ${testUser.email}`);
    console.log('   2. Visit: http://localhost:3000/dashboard');
    console.log('   3. You should see:');
    console.log('      - Questions answered');
    console.log('      - Accuracy rate');
    console.log('      - Best score');
    console.log('      - Recent sessions');
    console.log('      - Topic progress\n');

    console.log('🔍 To verify data in database:');
    console.log('   SELECT * FROM user_exam_attempts WHERE user_id = ' + testUser.id + ';');
    console.log('   SELECT * FROM user_progress WHERE user_id = ' + testUser.id + ';\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test data:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addTestData();


