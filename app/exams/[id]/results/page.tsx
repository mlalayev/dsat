'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/common/AnimatedBackground';
import { 
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExamResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params.id as string;
  const attemptId = searchParams.get('attempt_id');

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (attemptId) {
      fetchResults();
    }
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}/results?attempt_id=${attemptId}`);
      const data = await response.json();

      if (data.success) {
        setResults(data);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-white text-xl">Results not found</div>
      </div>
    );
  }

  const score = results.score || 0;
  const passingScore = results.passing_score || 70;
  const passed = score >= passingScore;

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      
      <main className="relative pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect p-8 rounded-2xl max-w-3xl mx-auto"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Result Header */}
            <div className="text-center mb-8">
              {passed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold mb-2 text-green-400">Congratulations!</h1>
                  <p className="text-gray-400">You passed the exam</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold mb-2 text-red-400">Keep Practicing!</h1>
                  <p className="text-gray-400">You didn't pass this time, but keep trying</p>
                </motion.div>
              )}
            </div>

            {/* Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 p-6 rounded-xl text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-3xl font-bold mb-1">{score}%</p>
                <p className="text-sm text-gray-400">Your Score</p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-3xl font-bold mb-1">{results.correct_answers || 0}/{results.total_questions || 0}</p>
                <p className="text-sm text-gray-400">Correct Answers</p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-3xl font-bold mb-1">
                  {Math.floor((results.time_spent || 0) / 60)}:{(results.time_spent || 0) % 60 < 10 ? '0' : ''}{(results.time_spent || 0) % 60}
                </p>
                <p className="text-sm text-gray-400">Time Spent</p>
              </div>
            </div>

            {/* Passing Score Info */}
            <div className={`p-4 rounded-xl mb-6 ${
              passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <p className="text-sm text-center">
                Passing Score: <span className="font-semibold">{passingScore}%</span>
                {' | '}
                Your Score: <span className={`font-semibold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {score}%
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-3 glass-effect rounded-xl hover:bg-white/20 transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push(`/exams/${examId}`)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Retake Exam
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

