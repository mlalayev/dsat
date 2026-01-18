import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST create new question (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      subject, 
      topic, 
      subtopic, 
      difficulty, 
      question_text, 
      choices, 
      correct_answer, 
      explanation 
    } = body;

    // Validate input
    if (!question_text || !choices || choices.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Question text and at least 2 choices are required' },
        { status: 400 }
      );
    }

    if (correct_answer === undefined || correct_answer < 0 || correct_answer >= choices.length) {
      return NextResponse.json(
        { success: false, message: 'Valid correct answer index is required' },
        { status: 400 }
      );
    }

    // Get user from request (you may need to add authentication middleware)
    // For now, we'll check if user is admin via a header or body parameter
    const userId = body.user_id;
    if (userId) {
      const userResult = await query('SELECT role FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Only admins can create questions' },
          { status: 403 }
        );
      }
    }

    // Format topic with subtopic if provided
    const fullTopic = subtopic ? `${topic} - ${subtopic}` : topic;

    // Map choices to option_a, option_b, option_c, option_d
    const option_a = choices[0] || '';
    const option_b = choices[1] || '';
    const option_c = choices[2] || null;
    const option_d = choices[3] || null;

    // Convert correct_answer index to letter (A, B, C, D)
    const correctAnswerLetter = String.fromCharCode(65 + correct_answer);

    // Insert question (exam_id can be null for standalone questions)
    const result = await query(
      `INSERT INTO questions (
        exam_id, 
        subject, 
        topic, 
        difficulty, 
        question_text, 
        option_a, 
        option_b, 
        option_c, 
        option_d, 
        correct_answer, 
        explanation, 
        points,
        created_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP) 
      RETURNING *`,
      [
        null, // exam_id - can be assigned later
        subject || (type === 'math' ? 'Mathematics' : 'Reading and Writing'),
        fullTopic,
        difficulty || 'medium',
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correctAnswerLetter,
        explanation || null,
        1 // default points
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Question created successfully',
      question: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create question',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET all questions (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');

    let queryText = 'SELECT * FROM questions WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (subject) {
      queryText += ` AND subject = $${paramCount}`;
      params.push(subject);
      paramCount++;
    }

    if (topic) {
      queryText += ` AND topic LIKE $${paramCount}`;
      params.push(`%${topic}%`);
      paramCount++;
    }

    if (difficulty) {
      queryText += ` AND difficulty = $${paramCount}`;
      params.push(difficulty);
      paramCount++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      questions: result.rows,
      count: result.rows.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch questions',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


