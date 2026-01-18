'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/common/AnimatedBackground';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  MoreVertical,
  Tag,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalQuestions: 0,
    totalTopics: 0,
    activeSessions: 0,
    newUsersToday: 0,
    questionsAddedToday: 0
  });

  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [questionDistribution, setQuestionDistribution] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, [user.id]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch(`/api/admin/stats?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
        setRecentExams(data.recentExams || []);
        setQuestionDistribution(data.questionDistribution || []);
        setUserGrowth(data.userGrowth || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      
      <main className="relative pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Admin Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">ADMIN</span>
                </div>
                <p className="text-gray-400">Manage questions, users, and platform analytics</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => router.push('/admin/questions')}
                  className="px-4 py-2 glass-effect rounded-xl hover:bg-white/20 transition-all flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>View All Questions</span>
                </button>
                <button 
                  onClick={() => router.push('/admin/add-question')}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Questions</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { 
                label: 'Total Users', 
                value: stats.totalUsers.toLocaleString(), 
                icon: Users, 
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                change: `+${stats.newUsersToday} today`
              },
              { 
                label: 'Total Exams', 
                value: stats.totalExams.toLocaleString(), 
                icon: FileText, 
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                change: `${stats.totalQuestions} questions`
              },
              { 
                label: 'Active Sessions', 
                value: stats.activeSessions, 
                icon: Clock, 
                color: 'text-green-400',
                bg: 'bg-green-500/10',
                change: 'Live'
              },
              { 
                label: 'Topics', 
                value: stats.totalTopics, 
                icon: Tag, 
                color: 'text-pink-400',
                bg: 'bg-pink-500/10',
                change: 'Active'
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
                  <span className="text-xs text-gray-400">{stat.change}</span>
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
                { id: 'questions', label: 'Questions', icon: FileText },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Questions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <span>Recent Questions</span>
                  </h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                </div>
                <div className="space-y-3">
                  {recentExams.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No exams yet</p>
                      <p className="text-sm mt-1">Create your first exam</p>
                    </div>
                  ) : (
                    recentExams.slice(0, 3).map((exam) => (
                      <div key={exam.id} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{exam.topic}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              exam.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                              exam.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {exam.difficulty || 'Medium'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {exam.status === 'Published' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                            )}
                            <button className="p-1 hover:bg-white/10 rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{exam.subject || exam.type}</span>
                          <span>{exam.questionCount || 0} questions</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {exam.created}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent Users */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span>Recent Users</span>
                  </h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                </div>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {user.joined}
                        </span>
                        {user.score > 0 && (
                          <span className="text-blue-400 font-semibold">Score: {user.score}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'questions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Question Management</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 glass-effect rounded-xl hover:bg-white/20 transition-all flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {recentExams.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No exams to manage</p>
                  </div>
                ) : (
                  recentExams.map((exam) => (
                    <div key={exam.id} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold">{exam.topic}</span>
                            <span className="text-sm text-gray-400">{exam.subject || exam.type}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              exam.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                              exam.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {exam.difficulty || 'Medium'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">Created: {exam.created} | {exam.questionCount || 0} questions</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => router.push(`/exams/${exam.id}`)}
                            className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 glass-effect rounded-lg hover:bg-red-500/20 transition-all">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 glass-effect rounded-xl hover:bg-white/20 transition-all flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="font-semibold">{user.name}</p>
                          <span className="text-sm text-gray-400">{user.email}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">Joined: {user.joined} | Score: {user.score || 'N/A'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 glass-effect rounded-lg hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6">User Growth (Last 7 Days)</h2>
                  {userGrowth.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No data yet</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-end justify-between gap-2">
                      {userGrowth.map((day, index) => {
                        const maxCount = Math.max(...userGrowth.map(d => d.count), 1);
                        const height = (day.count / maxCount) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t transition-all hover:opacity-80"
                                style={{ height: `${Math.max(height, 10)}px` }}
                              ></div>
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                {day.count}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 mt-2">
                              {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6">Question Distribution</h2>
                  {questionDistribution.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No questions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questionDistribution.slice(0, 5).map((item, index) => {
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500'];
                        return (
                          <div key={item.subject}>
                            <div className="flex justify-between text-sm mb-2">
                              <span>{item.subject}</span>
                              <span className="font-semibold">{item.count} ({item.percentage}%)</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${colors[index % colors.length]} rounded-full transition-all`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

