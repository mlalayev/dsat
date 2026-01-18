import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET admin statistics
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (userId) {
      const userResult = await query('SELECT role FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    // Get total users
    const usersResult = await query('SELECT COUNT(*) as total FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total);

    // Get new users today
    const newUsersTodayResult = await query(
      `SELECT COUNT(*) as count FROM users 
       WHERE DATE(created_at) = CURRENT_DATE`
    );
    const newUsersToday = parseInt(newUsersTodayResult.rows[0].count);

    // Get total exams
    const examsResult = await query('SELECT COUNT(*) as total FROM exams WHERE is_active = true');
    const totalExams = parseInt(examsResult.rows[0].total);

    // Get total questions
    const questionsResult = await query('SELECT COUNT(*) as total FROM questions');
    const totalQuestions = parseInt(questionsResult.rows[0].total);

    // Get questions added today
    const questionsAddedTodayResult = await query(
      `SELECT COUNT(*) as count FROM questions 
       WHERE DATE(created_at) = CURRENT_DATE`
    );
    const questionsAddedToday = parseInt(questionsAddedTodayResult.rows[0].count);

    // Get unique topics
    const topicsResult = await query(
      'SELECT COUNT(DISTINCT subject) as total FROM questions'
    );
    const totalTopics = parseInt(topicsResult.rows[0].total);

    // Get active sessions (users with attempts in last 24 hours)
    const activeSessionsResult = await query(
      `SELECT COUNT(DISTINCT user_id) as count FROM user_exam_attempts 
       WHERE completed_at >= NOW() - INTERVAL '24 hours'`
    );
    const activeSessions = parseInt(activeSessionsResult.rows[0].count);

    // Get recent users
    const recentUsersResult = await query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        COALESCE(MAX(uea.score), 0) as best_score,
        COUNT(uea.id) as attempts_count
       FROM users u
       LEFT JOIN user_exam_attempts uea ON u.id = uea.user_id
       GROUP BY u.id, u.name, u.email, u.role, u.created_at
       ORDER BY u.created_at DESC
       LIMIT 10`
    );

    const recentUsers = recentUsersResult.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      joined: new Date(user.created_at).toISOString().split('T')[0],
      status: parseInt(user.attempts_count) > 0 ? 'Active' : 'Inactive',
      score: parseInt(user.best_score),
    }));

    // Get recent exams/questions
    const recentExamsResult = await query(
      `SELECT 
        e.id,
        e.title,
        e.subject,
        e.difficulty,
        e.created_at,
        e.is_active,
        COUNT(q.id) as question_count
       FROM exams e
       LEFT JOIN questions q ON e.id = q.exam_id
       GROUP BY e.id, e.title, e.subject, e.difficulty, e.created_at, e.is_active
       ORDER BY e.created_at DESC
       LIMIT 10`
    );

    const recentExams = recentExamsResult.rows.map(exam => ({
      id: exam.id,
      topic: exam.title,
      subject: exam.subject,
      difficulty: exam.difficulty || 'Medium',
      type: 'Exam',
      status: exam.is_active ? 'Published' : 'Draft',
      created: new Date(exam.created_at).toISOString().split('T')[0],
      questionCount: parseInt(exam.question_count),
    }));

    // Get question distribution by subject
    const questionDistributionResult = await query(
      `SELECT 
        subject,
        COUNT(*) as count
       FROM questions
       GROUP BY subject
       ORDER BY count DESC`
    );

    const questionDistribution = questionDistributionResult.rows.map(item => ({
      subject: item.subject,
      count: parseInt(item.count),
      percentage: totalQuestions > 0 ? Math.round((parseInt(item.count) / totalQuestions) * 100) : 0,
    }));

    // Get user growth (last 7 days)
    const userGrowthResult = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
       FROM users
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    const userGrowth = userGrowthResult.rows.map(day => ({
      date: new Date(day.date).toISOString().split('T')[0],
      count: parseInt(day.count),
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        newUsersToday,
        totalExams,
        totalQuestions,
        questionsAddedToday,
        totalTopics,
        activeSessions,
      },
      recentUsers,
      recentExams,
      questionDistribution,
      userGrowth,
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch admin statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


