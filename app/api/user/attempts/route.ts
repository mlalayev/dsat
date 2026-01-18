import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET user's exam attempts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT 
        uea.*,
        e.title as exam_title,
        e.description as exam_description,
        e.passing_score
       FROM user_exam_attempts uea
       JOIN exams e ON uea.exam_id = e.id
       WHERE uea.user_id = $1
       ORDER BY uea.completed_at DESC`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      attempts: result.rows,
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user attempts',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


