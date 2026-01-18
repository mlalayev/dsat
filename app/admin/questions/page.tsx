'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/common/AnimatedBackground';
import { 
  ArrowLeft, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Question {
  id: number;
  subject: string;
  topic: string;
  difficulty: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string;
  explanation: string | null;
  created_at: string;
}

export default function QuestionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchQuestions();
  }, [router]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
        setFilteredQuestions(data.questions);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = questions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (filterSubject !== 'all') {
      filtered = filtered.filter(q => q.subject === filterSubject);
    }

    // Difficulty filter
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty);
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterSubject, filterDifficulty, questions]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setQuestions(questions.filter(q => q.id !== id));
        alert('Question deleted successfully');
      } else {
        alert(data.message || 'Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  const uniqueSubjects = Array.from(new Set(questions.map(q => q.subject)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      
      <main className="relative pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/admin/add-question')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Questions</span>
              </button>
            </div>
            <h1 className="text-4xl font-bold mb-2">All Questions</h1>
            <p className="text-gray-400">Manage and view all questions in the system</p>
          </motion.div>

          {/* Filters */}
          <div className="glass-effect p-6 rounded-2xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-slate-800">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject} className="bg-slate-800">{subject}</option>
                ))}
              </select>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-slate-800">All Difficulties</option>
                <option value="easy" className="bg-slate-800">Easy</option>
                <option value="medium" className="bg-slate-800">Medium</option>
                <option value="hard" className="bg-slate-800">Hard</option>
              </select>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredQuestions.length} of {questions.length} questions
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {currentQuestions.length === 0 ? (
              <div className="glass-effect p-12 rounded-2xl text-center">
                <p className="text-gray-400 text-lg mb-4">No questions found</p>
                <button
                  onClick={() => router.push('/admin/add-question')}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  Add Your First Question
                </button>
              </div>
            ) : (
              currentQuestions.map((question) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect p-6 rounded-2xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                          {question.subject}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                          {question.topic}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-white mb-4 line-clamp-2">{question.question_text}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className={`p-2 rounded-lg ${
                          question.correct_answer === 'A' ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5'
                        }`}>
                          <span className="text-gray-400">A:</span> {question.option_a}
                        </div>
                        <div className={`p-2 rounded-lg ${
                          question.correct_answer === 'B' ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5'
                        }`}>
                          <span className="text-gray-400">B:</span> {question.option_b}
                        </div>
                        {question.option_c && (
                          <div className={`p-2 rounded-lg ${
                            question.correct_answer === 'C' ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5'
                          }`}>
                            <span className="text-gray-400">C:</span> {question.option_c}
                          </div>
                        )}
                        {question.option_d && (
                          <div className={`p-2 rounded-lg ${
                            question.correct_answer === 'D' ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5'
                          }`}>
                            <span className="text-gray-400">D:</span> {question.option_d}
                          </div>
                        )}
                      </div>
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-500/10 rounded-lg text-sm text-gray-300">
                          <span className="font-semibold">Explanation: </span>
                          {question.explanation}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/admin/questions/${question.id}`)}
                        className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/questions/${question.id}/edit`)}
                        className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-2 glass-effect rounded-lg hover:bg-red-500/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 glass-effect rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


