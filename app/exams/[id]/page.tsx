'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/common/AnimatedBackground';
import { 
  Clock, 
  BookOpen, 
  CheckCircle2,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  points: number;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  total_questions: number;
  passing_score: number;
  subject: string;
}

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchExam();
  }, [examId, router]);

  useEffect(() => {
    if (isStarted && !isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, isPaused, timeRemaining]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}`);
      const data = await response.json();

      if (data.success) {
        setExam(data.exam);
        setQuestions(data.questions);
        setTimeRemaining(data.exam.duration * 60); // Convert minutes to seconds
      } else {
        alert('Exam not found');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch exam:', error);
      alert('Failed to load exam');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await submitExam();
  };

  const submitExam = async () => {
    if (!user || !exam) return;

    const unansweredCount = questions.length - answeredCount;
    if (unansweredCount > 0) {
      const confirmSubmit = confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to finish the exam?`
      );
      if (!confirmSubmit) return;
    } else {
      const confirmSubmit = confirm('Are you sure you want to finish and submit the exam?');
      if (!confirmSubmit) return;
    }

    try {
      const response = await fetch(`/api/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          answers: answers,
          time_spent: (exam.duration * 60) - timeRemaining,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/exams/${examId}/results?attempt_id=${data.result.attempt_id}`);
      } else {
        alert(data.message || 'Failed to submit exam');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading exam...</div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-white text-xl">No questions available for this exam</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      
      <main className="relative pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {!isStarted ? (
            // Exam Start Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect p-8 rounded-2xl max-w-2xl mx-auto"
            >
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>

              <h1 className="text-4xl font-bold mb-4">{exam.title}</h1>
              {exam.description && (
                <p className="text-gray-400 mb-6">{exam.description}</p>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Duration</span>
                  </div>
                  <span className="font-semibold">{exam.duration} minutes</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">Total Questions</span>
                  </div>
                  <span className="font-semibold">{exam.total_questions}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Passing Score</span>
                  </div>
                  <span className="font-semibold">{exam.passing_score}%</span>
                </div>

                {exam.subject && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="text-gray-300">Subject</span>
                    <span className="font-semibold">{exam.subject}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300">
                  <strong className="text-blue-400">Instructions:</strong> Once you start, the timer will begin. 
                  You can pause the exam, but make sure to complete all questions before time runs out. 
                  Good luck!
                </p>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Exam</span>
              </button>
            </motion.div>
          ) : (
            // Exam Taking Interface
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Timer and Navigation */}
              <div className="lg:col-span-1">
                <div className="glass-effect p-6 rounded-2xl sticky top-24">
                  {/* Timer */}
                  <div className="mb-6">
                    <div className={`text-center p-4 rounded-xl mb-3 ${
                      timeRemaining < 300 ? 'bg-red-500/20 border border-red-500/50' :
                      timeRemaining < 600 ? 'bg-yellow-500/20 border border-yellow-500/50' :
                      'bg-green-500/20 border border-green-500/50'
                    }`}>
                      <Clock className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold font-mono">
                        {formatTime(timeRemaining)}
                      </p>
                    </div>
                    <button
                      onClick={handlePause}
                      className="w-full py-2 glass-effect rounded-xl hover:bg-white/20 transition-all flex items-center justify-center space-x-2 text-sm"
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-semibold">{answeredCount}/{questions.length}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Navigation */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-3">Questions</p>
                    <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                      {questions.map((q, index) => {
                        const isAnswered = answers[q.id] !== undefined;
                        const isCurrent = index === currentQuestionIndex;
                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`p-2 rounded-lg text-sm font-semibold transition-all ${
                              isCurrent 
                                ? 'bg-blue-500 text-white' 
                                : isAnswered
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={submitExam}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Finish Exam'}
                  </button>
                  {answeredCount < questions.length && (
                    <p className="text-xs text-yellow-400 text-center mt-2">
                      {questions.length - answeredCount} unanswered
                    </p>
                  )}
                </div>
              </div>

              {/* Main Question Area */}
              <div className="lg:col-span-3">
                <div className="glass-effect p-6 rounded-2xl">
                  {currentQuestion && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                              {currentQuestion.subject}
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                              {currentQuestion.topic}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {currentQuestion.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold mb-6">{currentQuestion.question_text}</h2>

                      <div className="space-y-3 mb-6">
                        {['A', 'B', 'C', 'D'].map((option) => {
                          const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                          const optionText = currentQuestion[optionKey];
                          if (!optionText) return null;

                          const isSelected = answers[currentQuestion.id] === option;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleAnswerChange(currentQuestion.id, option)}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-blue-500/20 border-2 border-blue-500'
                                  : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isSelected ? 'bg-blue-500' : 'bg-white/10'
                                }`}>
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                                <span className="font-semibold mr-2">{option}.</span>
                                <span>{optionText}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <button
                          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-6 py-2 glass-effect rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        <span className="text-sm text-gray-400">
                          {currentQuestionIndex + 1} / {questions.length}
                        </span>

                        {currentQuestionIndex === questions.length - 1 ? (
                          <button
                            onClick={submitExam}
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isSubmitting ? 'Submitting...' : 'Finish Exam'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            className="px-6 py-2 glass-effect rounded-xl hover:bg-white/20 transition-all flex items-center space-x-2"
                          >
                            <span>Next</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

