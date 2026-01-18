'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/common/AnimatedBackground';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  Play,
  BarChart3,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Brain,
  Timer
} from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'progress' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
    studyTime: 0,
    currentStreak: 0,
    bestScore: 0,
    avgScore: 0,
    totalAttempts: 0
  });

  const [recentTopics, setRecentTopics] = useState<any[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchAvailableExams();
    fetchAllAttempts();
  }, [user.id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/stats?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentSessions(data.recentSessions || []);
        setRecentTopics(data.topicProgress || []);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableExams = async () => {
    try {
      const response = await fetch('/api/exams');
      const data = await response.json();
      
      if (data.success) {
        setAvailableExams(data.exams || []);
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    }
  };

  const fetchAllAttempts = async () => {
    try {
      const response = await fetch(`/api/user/attempts?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAllAttempts(data.attempts || []);
      }
    } catch (error) {
      console.error('Failed to fetch attempts:', error);
    }
  };

  const handleStartExam = (examId: number) => {
    router.push(`/exams/${examId}`);
  };

  // Calculate performance metrics from attempts
  const calculatePerformance = () => {
    if (allAttempts.length === 0) return { weekScore: 0, monthScore: 0, weekChange: 0, monthChange: 0 };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weekAttempts = allAttempts.filter(a => new Date(a.completed_at) >= weekAgo);
    const monthAttempts = allAttempts.filter(a => new Date(a.completed_at) >= monthAgo);
    const olderAttempts = allAttempts.filter(a => new Date(a.completed_at) < monthAgo);

    const weekAvg = weekAttempts.length > 0 
      ? weekAttempts.reduce((sum, a) => sum + a.score, 0) / weekAttempts.length 
      : 0;
    
    const monthAvg = monthAttempts.length > 0 
      ? monthAttempts.reduce((sum, a) => sum + a.score, 0) / monthAttempts.length 
      : 0;

    const olderAvg = olderAttempts.length > 0 
      ? olderAttempts.reduce((sum, a) => sum + a.score, 0) / olderAttempts.length 
      : stats.avgScore;

    const weekChange = olderAvg > 0 ? ((weekAvg - olderAvg) / olderAvg * 100) : 0;
    const monthChange = olderAvg > 0 ? ((monthAvg - olderAvg) / olderAvg * 100) : 0;

    return { 
      weekScore: Math.round(weekAvg), 
      monthScore: Math.round(monthAvg), 
      weekChange: Math.round(weekChange * 10) / 10,
      monthChange: Math.round(monthChange * 10) / 10
    };
  };

  const performance = calculatePerformance();

  const topics = [
    { 
      id: 1, 
      name: 'Math', 
      icon: Brain, 
      color: 'text-blue-400', 
      count: availableExams.filter(e => e.subject?.includes('Math')).reduce((sum, e) => sum + (e.total_questions || 0), 0) || availableExams.filter(e => e.subject?.includes('Math')).length
    },
    { 
      id: 2, 
      name: 'Reading', 
      icon: BookOpen, 
      color: 'text-purple-400', 
      count: availableExams.filter(e => e.subject?.includes('Reading')).reduce((sum, e) => sum + (e.total_questions || 0), 0) || availableExams.filter(e => e.subject?.includes('Reading')).length
    },
    { 
      id: 3, 
      name: 'SAT Prep', 
      icon: Target, 
      color: 'text-pink-400', 
      count: availableExams.filter(e => e.subject?.includes('SAT')).reduce((sum, e) => sum + (e.total_questions || 0), 0) || availableExams.filter(e => e.subject?.includes('SAT')).length
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      
      <main className="relative pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, <span className="text-gradient">{user.name}</span>!
                </h1>
                <p className="text-gray-400">Continue your SAT preparation journey</p>
              </div>
              <div className="flex items-center space-x-3">
                {availableExams.length > 0 && (
                  <button
                    onClick={() => setActiveTab('exams')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Take Exam</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { 
                label: 'Questions Answered', 
                value: stats.questionsAnswered > 0 ? stats.questionsAnswered.toLocaleString() : '0', 
                icon: BookOpen, 
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                change: stats.totalAttempts > 0 ? `${stats.totalAttempts} exams` : 'Start now'
              },
              { 
                label: 'Accuracy Rate', 
                value: `${stats.accuracy}%`, 
                icon: Target, 
                color: 'text-green-400',
                bg: 'bg-green-500/10',
                change: stats.accuracy >= 70 ? '✓ Good' : 'Keep going'
              },
              { 
                label: 'Study Time', 
                value: `${stats.studyTime}h`, 
                icon: Clock, 
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                change: stats.studyTime > 0 ? '📚' : 'Start'
              },
              { 
                label: 'Best Score', 
                value: stats.bestScore > 0 ? `${stats.bestScore}%` : '-', 
                icon: Zap, 
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10',
                change: stats.bestScore >= 80 ? '🔥' : '💪'
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect p-6 rounded-2xl hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-green-400 font-semibold">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-2 border-b border-white/10">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'exams', label: 'Exams', icon: BookOpen },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'analytics', label: 'Analytics', icon: Target },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 flex items-center space-x-2 font-semibold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Start Topics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-effect p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-400" />
                <span>Practice Topics</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    className="glass-effect p-4 rounded-xl hover:bg-white/15 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <topic.icon className={`w-8 h-8 ${topic.color}`} />
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-semibold mb-1">{topic.name}</h3>
                    <p className="text-sm text-gray-400">{topic.count} {topic.count === 1 ? 'question' : 'questions'}</p>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('exams')}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Browse All Exams
              </button>
            </motion.div>

            {/* Performance Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <span>Performance</span>
              </h2>
              <div className="space-y-4">
                {allAttempts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No performance data yet</p>
                    <p className="text-sm mt-1">Take exams to track your performance</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">This Week</span>
                        <span className={`font-semibold ${performance.weekChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {performance.weekChange >= 0 ? '+' : ''}{performance.weekChange}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all" style={{ width: `${Math.min(performance.weekScore, 100)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">This Month</span>
                        <span className={`font-semibold ${performance.monthChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {performance.monthChange >= 0 ? '+' : ''}{performance.monthChange}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all" style={{ width: `${Math.min(performance.monthScore, 100)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Overall Accuracy</span>
                        <span className="font-semibold">{stats.accuracy}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-red-600 rounded-full transition-all" style={{ width: `${stats.accuracy}%` }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg Score</p>
                    <p className="text-2xl font-bold">{stats.avgScore > 0 ? `${stats.avgScore}%` : '-'}</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </motion.div>
          </div>

          )}

          {activeTab === 'exams' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-effect p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <span>Available Exams</span>
                </h2>
                {availableExams.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No exams available</p>
                    <p className="text-sm">Check back later for new exams</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableExams.map((exam) => (
                      <div key={exam.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{exam.description || 'No description available'}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm whitespace-nowrap ml-3">
                            {exam.subject || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {exam.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {exam.total_questions} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {exam.passing_score}% to pass
                          </span>
                        </div>
                        <button
                          onClick={() => handleStartExam(exam.id)}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center space-x-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start Exam</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Sessions */}
                <motion.div
                  className="glass-effect p-6 rounded-2xl"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-orange-400" />
                    <span>Recent Sessions</span>
                  </h2>
                  <div className="space-y-4">
                    {recentSessions.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No practice sessions yet</p>
                        <p className="text-sm mt-1">Take your first exam to see your progress here</p>
                      </div>
                    ) : (
                      recentSessions.map((session) => (
                        <div key={session.id} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{session.topic}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              session.score >= 80 ? 'bg-green-500/20 text-green-400' :
                              session.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {session.score}%
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {session.questions} questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer className="w-4 h-4" />
                              {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {session.date}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>

                {/* Topic Progress */}
                <motion.div
                  className="glass-effect p-6 rounded-2xl"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <span>Topic Progress</span>
                  </h2>
                  <div className="space-y-4">
                    {recentTopics.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No topic progress yet</p>
                        <p className="text-sm mt-1">Complete exams to track your progress by topic</p>
                      </div>
                    ) : (
                      recentTopics.map((topic, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{topic.subject} - {topic.topic}</h3>
                            <span className="text-sm text-gray-400">{topic.correct}/{topic.questions}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                              style={{ width: `${topic.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{topic.progress}% Complete</span>
                            <span className="flex items-center gap-1">
                              {topic.progress >= 80 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-yellow-400" />
                              )}
                              {topic.progress >= 80 ? 'Mastered' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    <span>Score Trend</span>
                  </h2>
                  {allAttempts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No exam attempts yet</p>
                      <p className="text-sm">Take exams to see your score trends</p>
                    </div>
                  ) : (
                    <div className="h-64 flex items-end justify-between gap-2">
                      {allAttempts.slice(0, 7).reverse().map((attempt, index) => {
                        const maxScore = Math.max(...allAttempts.map(a => a.score), 100);
                        const height = (attempt.score / maxScore) * 100;
                        return (
                          <div key={attempt.id} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t transition-all hover:opacity-80"
                                style={{ height: `${Math.max(height, 10)}px` }}
                              ></div>
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {attempt.score}%
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 mt-2">
                              {new Date(attempt.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Performance Stats */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                    <Target className="w-6 h-6 text-green-400" />
                    <span>Performance Overview</span>
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Overall Accuracy</span>
                        <span className="font-semibold">{stats.accuracy}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: `${stats.accuracy}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Average Score</span>
                        <span className="font-semibold">{stats.avgScore > 0 ? `${stats.avgScore}%` : '-'}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: `${stats.avgScore}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Best Score</span>
                        <span className="font-semibold">{stats.bestScore > 0 ? `${stats.bestScore}%` : '-'}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-red-600 rounded-full" style={{ width: `${stats.bestScore}%` }}></div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Total Attempts</p>
                          <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Study Time</p>
                          <p className="text-2xl font-bold">{stats.studyTime}h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Attempts Table */}
              {allAttempts.length > 0 && (
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-orange-400" />
                    <span>All Exam Attempts</span>
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 text-gray-400 font-semibold">Exam</th>
                          <th className="text-left py-3 text-gray-400 font-semibold">Score</th>
                          <th className="text-left py-3 text-gray-400 font-semibold">Questions</th>
                          <th className="text-left py-3 text-gray-400 font-semibold">Status</th>
                          <th className="text-left py-3 text-gray-400 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allAttempts.map((attempt) => (
                          <tr key={attempt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 font-semibold">{attempt.exam_title || 'Unknown Exam'}</td>
                            <td className="py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                attempt.score >= 80 ? 'bg-green-500/20 text-green-400' :
                                attempt.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {attempt.score}%
                              </span>
                            </td>
                            <td className="py-3 text-gray-400">{attempt.correct_answers}/{attempt.total_questions}</td>
                            <td className="py-3">
                              {attempt.passed ? (
                                <span className="flex items-center gap-1 text-green-400">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Passed
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-red-400">
                                  <XCircle className="w-4 h-4" />
                                  Failed
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-gray-400">
                              {new Date(attempt.completed_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

