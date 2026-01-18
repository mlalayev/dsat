import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET user statistics
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

    // Get exam attempts stats
    const attemptsResult = await query(
      `SELECT 
        COUNT(*) as total_attempts,
        SUM(correct_answers) as total_correct,
        SUM(total_questions) as total_questions,
        MAX(score) as best_score,
        AVG(score) as avg_score,
        SUM(time_spent) as total_time_seconds
       FROM user_exam_attempts 
       WHERE user_id = $1`,
      [userId]
    );

    const attempts = attemptsResult.rows[0];
    const totalTimeHours = Math.round((attempts.total_time_seconds || 0) / 3600);
    const accuracy = attempts.total_questions > 0 
      ? Math.round((attempts.total_correct / attempts.total_questions) * 100) 
      : 0;

    // Get recent exam attempts
    const recentAttemptsResult = await query(
      `SELECT 
        uea.id,
        uea.score,
        uea.correct_answers,
        uea.total_questions,
        uea.time_spent,
        uea.completed_at,
        e.title as exam_title,
        e.subject
       FROM user_exam_attempts uea
       JOIN exams e ON uea.exam_id = e.id
       WHERE uea.user_id = $1
       ORDER BY uea.completed_at DESC
       LIMIT 5`,
      [userId]
    );

    // Get topic progress from user_progress table
    const topicProgressResult = await query(
      `SELECT 
        subject,
        topic,
        questions_attempted,
        questions_correct,
        total_time_spent,
        last_practiced
       FROM user_progress
       WHERE user_id = $1
       ORDER BY last_practiced DESC
       LIMIT 10`,
      [userId]
    );

    // Calculate streak (simplified - days with activity)
    const streakResult = await query(
      `SELECT COUNT(DISTINCT DATE(completed_at)) as streak_days
       FROM user_exam_attempts
       WHERE user_id = $1 
       AND completed_at >= NOW() - INTERVAL '30 days'`,
      [userId]
    );

    const stats = {
      questionsAnswered: parseInt(attempts.total_questions) || 0,
      correctAnswers: parseInt(attempts.total_correct) || 0,
      accuracy: accuracy,
      studyTime: totalTimeHours,
      currentStreak: parseInt(streakResult.rows[0]?.streak_days) || 0,
      bestScore: parseInt(attempts.best_score) || 0,
      avgScore: Math.round(parseFloat(attempts.avg_score) || 0),
      totalAttempts: parseInt(attempts.total_attempts) || 0,
    };

    const recentSessions = recentAttemptsResult.rows.map(session => ({
      id: session.id,
      topic: session.exam_title,
      subject: session.subject,
      score: session.score,
      questions: session.total_questions,
      correct: session.correct_answers,
      time: Math.round(session.time_spent / 60) + ' min',
      date: new Date(session.completed_at).toISOString().split('T')[0],
    }));

    const topicProgress = topicProgressResult.rows.map(topic => ({
      subject: topic.subject,
      topic: topic.topic,
      questions: topic.questions_attempted,
      correct: topic.questions_correct,
      progress: topic.questions_attempted > 0 
        ? Math.round((topic.questions_correct / topic.questions_attempted) * 100) 
        : 0,
      lastPracticed: topic.last_practiced,
    }));

    return NextResponse.json({
      success: true,
      stats,
      recentSessions,
      topicProgress,
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


