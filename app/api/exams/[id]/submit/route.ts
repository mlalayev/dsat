import { NextRequest, NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

// POST submit exam answers
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await getClient();
  
  try {
    const examId = params.id;
    const body = await request.json();
    const { user_id, answers, time_spent } = body;

    // Validate input
    if (!user_id || !answers) {
      return NextResponse.json(
        { success: false, message: 'User ID and answers are required' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Get exam details
    const examResult = await client.query(
      'SELECT * FROM exams WHERE id = $1',
      [examId]
    );

    if (examResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    const exam = examResult.rows[0];

    // Get all questions with correct answers
    const questionsResult = await client.query(
      'SELECT id, correct_answer, points FROM questions WHERE exam_id = $1',
      [examId]
    );

    const questions = questionsResult.rows;
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    // Calculate score
    const questionResponses = [];
    for (const question of questions) {
      totalPoints += question.points || 1;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points || 1;
      }

      questionResponses.push({
        question_id: question.id,
        user_answer: userAnswer || null,
        is_correct: isCorrect,
      });
    }

    const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = scorePercentage >= exam.passing_score;

    // Insert exam attempt
    const attemptResult = await client.query(
      `INSERT INTO user_exam_attempts 
       (user_id, exam_id, score, total_questions, correct_answers, time_spent, passed, started_at, completed_at, answers) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $8) 
       RETURNING *`,
      [user_id, examId, scorePercentage, questions.length, correctAnswers, time_spent, passed, JSON.stringify(answers)]
    );

    const attemptId = attemptResult.rows[0].id;

    // Insert individual question responses
    for (const response of questionResponses) {
      await client.query(
        `INSERT INTO user_question_responses (attempt_id, question_id, user_answer, is_correct, created_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [attemptId, response.question_id, response.user_answer, response.is_correct]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Exam submitted successfully',
      result: {
        attempt_id: attemptId,
        score: scorePercentage,
        correct_answers: correctAnswers,
        total_questions: questions.length,
        passed,
        time_spent,
      },
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Submit exam error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit exam',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}


