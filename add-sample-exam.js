// Add Sample Exam with Questions
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function addSampleExam() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'preppulse_db',
  });

  try {
    console.log('📚 Adding sample exam...\n');

    // Get admin user
    const adminResult = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    
    if (adminResult.rows.length === 0) {
      console.log('❌ No admin user found. Run create-admin.js first.');
      await pool.end();
      process.exit(1);
    }

    const adminId = adminResult.rows[0].id;

    // Create exam
    const examResult = await pool.query(
      `INSERT INTO exams (title, description, duration, total_questions, passing_score, subject, created_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING id, title`,
      [
        'Digital SAT Practice Test',
        'A comprehensive practice test covering mathematics and reading',
        90,
        10,
        70,
        'SAT Prep',
        adminId
      ]
    );

    const examId = examResult.rows[0].id;
    console.log('✅ Created exam:', examResult.rows[0].title);
    console.log('   Exam ID:', examId, '\n');

    // Add questions
    const questions = [
      {
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 'easy',
        question_text: 'If 2x + 5 = 15, what is the value of x?',
        option_a: 'x = 3',
        option_b: 'x = 5',
        option_c: 'x = 7',
        option_d: 'x = 10',
        correct_answer: 'B',
        explanation: 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5',
        points: 1
      },
      {
        subject: 'Mathematics',
        topic: 'Geometry',
        difficulty: 'medium',
        question_text: 'What is the area of a circle with radius 5?',
        option_a: '25π',
        option_b: '10π',
        option_c: '5π',
        option_d: '50π',
        correct_answer: 'A',
        explanation: 'Area = πr², so Area = π(5²) = 25π',
        points: 1
      },
      {
        subject: 'Mathematics',
        topic: 'Arithmetic',
        difficulty: 'easy',
        question_text: 'What is 15% of 80?',
        option_a: '10',
        option_b: '12',
        option_c: '15',
        option_d: '20',
        correct_answer: 'B',
        explanation: '15% of 80 = 0.15 × 80 = 12',
        points: 1
      },
      {
        subject: 'Reading',
        topic: 'Vocabulary',
        difficulty: 'medium',
        question_text: 'Which word is closest in meaning to "ubiquitous"?',
        option_a: 'Rare',
        option_b: 'Everywhere',
        option_c: 'Ancient',
        option_d: 'Expensive',
        correct_answer: 'B',
        explanation: 'Ubiquitous means present, appearing, or found everywhere',
        points: 1
      },
      {
        subject: 'Reading',
        topic: 'Grammar',
        difficulty: 'easy',
        question_text: 'Choose the correct sentence:',
        option_a: 'She don\'t like apples',
        option_b: 'She doesn\'t likes apples',
        option_c: 'She doesn\'t like apples',
        option_d: 'She not like apples',
        correct_answer: 'C',
        explanation: 'The correct form uses "doesn\'t" with the base verb "like"',
        points: 1
      },
      {
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 'hard',
        question_text: 'If f(x) = 2x² + 3x - 5, what is f(2)?',
        option_a: '5',
        option_b: '7',
        option_c: '9',
        option_d: '11',
        correct_answer: 'C',
        explanation: 'f(2) = 2(2²) + 3(2) - 5 = 2(4) + 6 - 5 = 8 + 6 - 5 = 9',
        points: 2
      },
      {
        subject: 'Reading',
        topic: 'Comprehension',
        difficulty: 'medium',
        question_text: 'What is the main purpose of a thesis statement?',
        option_a: 'To conclude the essay',
        option_b: 'To present the main argument',
        option_c: 'To provide examples',
        option_d: 'To introduce the author',
        correct_answer: 'B',
        explanation: 'A thesis statement presents the main argument or claim of an essay',
        points: 1
      },
      {
        subject: 'Mathematics',
        topic: 'Statistics',
        difficulty: 'medium',
        question_text: 'What is the median of: 3, 7, 9, 15, 21?',
        option_a: '7',
        option_b: '9',
        option_c: '11',
        option_d: '15',
        correct_answer: 'B',
        explanation: 'The median is the middle value when numbers are ordered: 9',
        points: 1
      },
      {
        subject: 'Mathematics',
        topic: 'Trigonometry',
        difficulty: 'hard',
        question_text: 'What is sin(90°)?',
        option_a: '0',
        option_b: '0.5',
        option_c: '1',
        option_d: 'undefined',
        correct_answer: 'C',
        explanation: 'sin(90°) = 1 (maximum value of sine function)',
        points: 2
      },
      {
        subject: 'Reading',
        topic: 'Literary Devices',
        difficulty: 'medium',
        question_text: 'What literary device is "The wind whispered through the trees"?',
        option_a: 'Metaphor',
        option_b: 'Simile',
        option_c: 'Personification',
        option_d: 'Alliteration',
        correct_answer: 'C',
        explanation: 'Personification gives human characteristics to non-human things',
        points: 1
      }
    ];

    console.log('Adding questions...');
    for (const q of questions) {
      await pool.query(
        `INSERT INTO questions (exam_id, subject, topic, difficulty, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, points)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [examId, q.subject, q.topic, q.difficulty, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation, q.points]
      );
      console.log(`   ✓ ${q.subject} - ${q.topic}`);
    }

    console.log('\n🎉 Sample exam added successfully!');
    console.log('\n📊 Exam Details:');
    console.log('   Title: Digital SAT Practice Test');
    console.log('   Questions:', questions.length);
    console.log('   Duration: 90 minutes');
    console.log('   Passing Score: 70%');
    console.log('\n🌐 View in dashboard: http://localhost:3000/dashboard\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample exam:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addSampleExam();


