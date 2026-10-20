import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Loader2,
  X,
  AlertCircle,
  History,
} from 'lucide-react';
import api from '../../api/client';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const QuizListPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Generator Modal
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genSubjectId, setGenSubjectId] = useState('');
  const [genTopicId, setGenTopicId] = useState('');
  const [topicsForSub, setTopicsForSub] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, aRes, sRes] = await Promise.all([
        api.get('/quizzes'),
        api.get('/quizzes/attempts/history'),
        api.get('/curriculum/subjects'),
      ]);

      if (qRes.data?.success) setQuizzes(qRes.data.data.quizzes || []);
      if (aRes.data?.success) setAttempts(aRes.data.data.attempts || []);
      if (sRes.data?.success) setSubjects(sRes.data.data.subjects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!genSubjectId) {
      setTopicsForSub([]);
      setGenTopicId('');
      return;
    }
    const sub = subjects.find(s => s._id === genSubjectId);
    if (sub) {
      api.get(`/curriculum/subjects/${sub.slug}`)
        .then(res => {
          if (res.data?.success) setTopicsForSub(res.data.data.subject.topics || []);
        })
        .catch(err => console.error(err));
    }
  }, [genSubjectId, subjects]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGenerating(true);

    try {
      const res = await api.post('/quizzes/generate', {
        subjectId: genSubjectId || undefined,
        topicId: genTopicId || undefined,
        difficulty,
        questionCount,
        timeLimitMinutes: Math.max(5, questionCount * 2),
      });

      if (res.data?.success) {
        setIsGeneratorOpen(false);
        navigate(`/quiz/${res.data.data.quizId}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Quiz generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Diagnostic Quizzes & Assessments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Server-graded assessments that diagnose knowledge gaps and weak topics.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Generate New Quiz with AI
        </button>
      </div>

      {/* Available Quizzes Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500" /> Available Quizzes
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : quizzes.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No Quizzes Available"
            description="Generate a diagnostic quiz from your computer science curriculum or uploaded notes."
            actionText="Generate Quiz"
            onAction={() => setIsGeneratorOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((q) => (
              <div
                key={q._id}
                onClick={() => navigate(`/quiz/${q._id}`)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 capitalize">
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {q.timeLimitMinutes || 10}m
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-1">
                    {q.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {q.questionCount} Questions · Multiple Choice & True/False
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {q.bestScore !== null ? `Best: ${q.bestScore}%` : 'Not attempted'}
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Start Test <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Attempts History */}
      {attempts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-violet-500" /> Past Assessment Attempts
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {attempts.map((att) => (
              <div
                key={att._id}
                onClick={() => navigate(`/quiz/results/${att._id}`)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{att.quizTitle}</h4>
                  <div className="flex items-center gap-3 text-slate-400 mt-1">
                    <span>{new Date(att.attemptedAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{Math.round(att.timeSpentSeconds / 60)} mins</span>
                    {att.weakTopicsIdentified && att.weakTopicsIdentified.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-amber-500">
                          {att.weakTopicsIdentified.length} weak area{att.weakTopicsIdentified.length > 1 ? 's' : ''} detected
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{att.percentage}%</span>
                    <p className={`text-[11px] font-semibold ${att.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {att.passed ? 'Passed ✓' : 'Needs Review'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Generate AI Quiz
              </h3>
              <button onClick={() => setIsGeneratorOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerateQuiz} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Subject
                </label>
                <select
                  value={genSubjectId}
                  onChange={(e) => setGenSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="">-- General CS or Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {genSubjectId && topicsForSub.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Specific Module
                  </label>
                  <select
                    value={genTopicId}
                    onChange={(e) => setGenTopicId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="">-- Comprehensive Across Subject --</option>
                    {topicsForSub.map(t => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Questions: {questionCount}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full accent-indigo-600 mt-2"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Formulating Assessment Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Quiz
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
