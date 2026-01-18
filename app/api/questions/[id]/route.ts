import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// DELETE question (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = parseInt(params.id);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid question ID' },
        { status: 400 }
      );
    }

    // Check if question exists
    const checkResult = await query('SELECT id FROM questions WHERE id = $1', [questionId]);
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      );
    }

    // Delete the question
    await query('DELETE FROM questions WHERE id = $1', [questionId]);

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete question',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


