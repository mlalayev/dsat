import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all active exams
export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT e.*, u.name as creator_name 
       FROM exams e 
       LEFT JOIN users u ON e.created_by = u.id 
       WHERE e.is_active = true 
       ORDER BY e.created_at DESC`
    );

    return NextResponse.json({
      success: true,
      exams: result.rows,
    });
  } catch (error) {
    console.error('Get exams error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch exams',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST create new exam (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, duration, total_questions, passing_score, subject, created_by } = body;

    // Validate input
    if (!title || !duration || !total_questions || !passing_score) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if user is admin
    if (created_by) {
      const userResult = await query('SELECT role FROM users WHERE id = $1', [created_by]);
      if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Only admins can create exams' },
          { status: 403 }
        );
      }
    }

    const result = await query(
      `INSERT INTO exams (title, description, duration, total_questions, passing_score, subject, created_by, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [title, description, duration, total_questions, passing_score, subject, created_by]
    );

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      exam: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Create exam error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create exam',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


