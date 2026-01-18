'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/common/AnimatedBackground';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X,
  BookOpen,
  Calculator,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AddQuestionPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [questionType, setQuestionType] = useState<'math' | 'reading_writing'>('math');
  const [mainTopic, setMainTopic] = useState<string>('');
  const [subTopic, setSubTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const readingWritingTopics = {
    'Information and Ideas': [
      'Central Ideas and Details',
      'Inferences',
      'Command of Evidence'
    ],
    'Craft and Structure': [
      'Words in Context',
      'Text Structure and Purpose',
      'Cross-Text Connections'
    ],
    'Expression of Ideas': [
      'Rhetorical Synthesis',
      'Transitions'
    ],
    'Standard English Conventions': [
      'Boundaries',
      'Form, Structure, and Sense'
    ]
  };

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
    setLoading(false);
  }, [router]);

  const handleAddChoice = () => {
    if (choices.length < 6) {
      setChoices([...choices, '']);
    }
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length > 2) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
      if (correctAnswer >= newChoices.length) {
        setCorrectAnswer(0);
      }
    }
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addQuestionToList = () => {
    // Validation
    if (!questionText.trim()) {
      alert('Please enter question text');
      return;
    }

    if (questionType === 'reading_writing' && (!mainTopic || !subTopic)) {
      alert('Please select topic and subtopic');
      return;
    }

    if (questionType === 'math' && !mainTopic.trim()) {
      alert('Please enter a math topic');
      return;
    }

    if (choices.filter(c => c.trim()).length < 2) {
      alert('Please provide at least 2 answer choices');
      return;
    }

    const newQuestion = {
      id: Date.now(), // temporary ID
      type: questionType,
      subject: questionType === 'math' ? 'Mathematics' : 'Reading and Writing',
      topic: questionType === 'math' ? mainTopic : mainTopic,
      subtopic: questionType === 'reading_writing' ? subTopic : null,
      difficulty,
      question_text: questionText,
      choices: [...choices.filter(c => c.trim())],
      correct_answer: correctAnswer,
      explanation
    };

    setQuestionsList([...questionsList, newQuestion]);
    
    // Reset form for next question
    setQuestionText('');
    setChoices(['', '', '', '']);
    setCorrectAnswer(0);
    setExplanation('');
  };

  const removeQuestionFromList = (id: number) => {
    setQuestionsList(questionsList.filter(q => q.id !== id));
  };

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questionsList.length === 0) {
      alert('Please add at least one question to the list');
      return;
    }

    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please login first');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setSaving(true);

    try {
      // Save all questions
      const promises = questionsList.map(question => {
        const questionData = {
          type: question.type,
          subject: question.subject,
          topic: question.topic,
          subtopic: question.subtopic,
          difficulty: question.difficulty,
          question_text: question.question_text,
          choices: question.choices,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          user_id: parsedUser.id
        };

        return fetch('/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(questionData),
        });
      });

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));

      const successCount = results.filter(r => r.success).length;
      
      if (successCount === questionsList.length) {
        alert(`Successfully added ${successCount} question(s)!`);
        setQuestionsList([]);
        setMainTopic('');
        setSubTopic('');
      } else {
        alert(`Added ${successCount} of ${questionsList.length} questions. Some may have failed.`);
      }
    } catch (error) {
      console.error('Error adding questions:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">Add Questions</h1>
            <p className="text-gray-400">Create multiple questions for the same topic and subtopic</p>
          </motion.div>

          <form onSubmit={handleSubmitAll}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Question Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Question Type Selection */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-4">Question Type</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionType('math');
                        setMainTopic('');
                        setSubTopic('');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        questionType === 'math'
                          ? 'border-blue-400 bg-blue-500/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <p className="font-semibold">Math</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionType('reading_writing');
                        setMainTopic('');
                        setSubTopic('');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        questionType === 'reading_writing'
                          ? 'border-purple-400 bg-purple-500/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <FileText className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="font-semibold">Reading & Writing</p>
                    </button>
                  </div>
                </div>

                {/* Topic Selection */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-4">Topic Selection</h2>
                  
                  {questionType === 'math' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Math Topic
                      </label>
                      <input
                        type="text"
                        value={mainTopic}
                        onChange={(e) => setMainTopic(e.target.value)}
                        placeholder="e.g., Algebra, Geometry, Data Analysis"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Main Topic
                        </label>
                        <select
                          value={mainTopic}
                          onChange={(e) => {
                            setMainTopic(e.target.value);
                            setSubTopic('');
                          }}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select a topic</option>
                          {Object.keys(readingWritingTopics).map((topic) => (
                            <option key={topic} value={topic} className="bg-slate-800">
                              {topic}
                            </option>
                          ))}
                        </select>
                      </div>

                      {mainTopic && readingWritingTopics[mainTopic as keyof typeof readingWritingTopics] && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subtopic
                          </label>
                          <select
                            value={subTopic}
                            onChange={(e) => setSubTopic(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select a subtopic</option>
                            {readingWritingTopics[mainTopic as keyof typeof readingWritingTopics].map((sub) => (
                              <option key={sub} value={sub} className="bg-slate-800">
                                {sub}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Difficulty */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-4">Difficulty</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`p-3 rounded-xl border-2 transition-all capitalize ${
                          difficulty === level
                            ? level === 'easy' ? 'border-green-400 bg-green-500/10 text-green-400' :
                              level === 'medium' ? 'border-yellow-400 bg-yellow-500/10 text-yellow-400' :
                              'border-red-400 bg-red-500/10 text-red-400'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Text */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-4">Question Text</h2>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter your question here..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                {/* Answer Choices */}
                <div className="glass-effect p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Answer Choices</h2>
                    {choices.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddChoice}
                        className="px-3 py-1 glass-effect rounded-lg hover:bg-white/20 transition-all flex items-center space-x-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Choice</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {choices.map((choice, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={correctAnswer === index}
                          onChange={() => setCorrectAnswer(index)}
                          className="w-5 h-5 text-blue-500"
                        />
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) => handleChoiceChange(index, e.target.value)}
                          placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {choices.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveChoice(index)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-4">Explanation (Optional)</h2>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Explain why the correct answer is correct..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="lg:col-span-1">
                <div className="glass-effect p-6 rounded-2xl sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Preview</h2>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Type</p>
                      <p className="font-semibold capitalize">{questionType === 'math' ? 'Math' : 'Reading & Writing'}</p>
                    </div>
                    {mainTopic && (
                      <div>
                        <p className="text-gray-400 mb-1">Topic</p>
                        <p className="font-semibold">{mainTopic}</p>
                      </div>
                    )}
                    {subTopic && (
                      <div>
                        <p className="text-gray-400 mb-1">Subtopic</p>
                        <p className="font-semibold">{subTopic}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400 mb-1">Difficulty</p>
                      <p className="font-semibold capitalize">{difficulty}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Choices</p>
                      <p className="font-semibold">{choices.filter(c => c.trim()).length}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={addQuestionToList}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to List</span>
                    </button>
                    
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Questions in list:</p>
                      <p className="text-2xl font-bold">{questionsList.length}</p>
                    </div>

                    {questionsList.length > 0 && (
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : `Save All (${questionsList.length})`}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Questions List */}
          {questionsList.length > 0 && (
            <div className="mt-8 glass-effect p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Questions to Save ({questionsList.length})</h2>
                <button
                  type="button"
                  onClick={() => setQuestionsList([])}
                  className="px-4 py-2 glass-effect rounded-xl hover:bg-red-500/20 transition-all text-sm text-red-400"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questionsList.map((question, index) => (
                  <div key={question.id} className="bg-white/5 p-4 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                            {question.subject}
                          </span>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                            {question.topic}{question.subtopic ? ` - ${question.subtopic}` : ''}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {question.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">{question.question_text}</p>
                        <p className="text-xs text-gray-400">
                          Correct: {String.fromCharCode(65 + question.correct_answer)} | 
                          Choices: {question.choices.length}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestionFromList(question.id)}
                        className="ml-4 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

