import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET exam results
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;
    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get('attempt_id');

    if (!attemptId) {
      return NextResponse.json(
        { success: false, message: 'Attempt ID is required' },
        { status: 400 }
      );
    }

    // Get attempt details
    const attemptResult = await query(
      `SELECT uea.*, e.title, e.passing_score, e.subject
       FROM user_exam_attempts uea
       JOIN exams e ON uea.exam_id = e.id
       WHERE uea.id = $1 AND uea.exam_id = $2`,
      [attemptId, examId]
    );

    if (attemptResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Results not found' },
        { status: 404 }
      );
    }

    const attempt = attemptResult.rows[0];

    return NextResponse.json({
      success: true,
      score: attempt.score,
      correct_answers: attempt.correct_answers,
      total_questions: attempt.total_questions,
      time_spent: attempt.time_spent,
      passed: attempt.passed,
      passing_score: attempt.passing_score,
      exam_title: attempt.title,
      subject: attempt.subject,
      completed_at: attempt.completed_at,
    }, { status: 200 });

  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch results',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


