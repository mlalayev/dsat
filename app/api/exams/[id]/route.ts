import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET single exam with questions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;

    // Get exam details
    const examResult = await query(
      `SELECT e.*, u.name as creator_name 
       FROM exams e 
       LEFT JOIN users u ON e.created_by = u.id 
       WHERE e.id = $1`,
      [examId]
    );

    if (examResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Get exam questions (without correct answers for regular users)
    const questionsResult = await query(
      `SELECT id, subject, topic, difficulty, question_text, option_a, option_b, option_c, option_d, points 
       FROM questions 
       WHERE exam_id = $1 
       ORDER BY id`,
      [examId]
    );

    return NextResponse.json({
      success: true,
      exam: examResult.rows[0],
      questions: questionsResult.rows,
    });
  } catch (error) {
    console.error('Get exam error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch exam',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE exam (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;

    // Soft delete - mark as inactive
    const result = await query(
      'UPDATE exams SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [examId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete exam',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


