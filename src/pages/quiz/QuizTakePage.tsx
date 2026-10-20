import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import api from '../../api/client';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const QuizTakePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/quizzes/${id}`)
      .then(res => {
        if (res.data?.success) {
          const q = res.data.data.quiz;
          setQuiz(q);
          setTimeLeftSeconds((q.timeLimitMinutes || 10) * 60);
        }
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to load quiz.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (loading || submitting || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, submitting, timeLeftSeconds]);

  const handleSelectAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!id || submitting) return;
    setSubmitting(true);
    setError(null);

    const totalSeconds = (quiz?.timeLimitMinutes || 10) * 60;
    const timeSpent = Math.max(10, totalSeconds - timeLeftSeconds);

    try {
      const res = await api.post(`/quizzes/${id}/submit`, {
        studentAnswers: answers,
        timeSpentSeconds: timeSpent,
      });

      if (res.data?.success) {
        navigate(`/quiz/results/${res.data.data.attempt._id}`, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Submission failed.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto py-12"><CardSkeleton /></div>;
  if (!quiz) return <div className="text-center py-12">Quiz not found.</div>;

  const currentQ = quiz.questions[currentIdx];
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <NavLink
          to="/quiz"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Quiz
        </NavLink>

        {/* Countdown Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
          timeLeftSeconds < 120
            ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Progress & Stepper */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
          <span className="font-bold text-slate-900 dark:text-white truncate">{quiz.title}</span>
          <span>Question {currentIdx + 1} of {quiz.questions.length} ({answeredCount} answered)</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {currentQ.type === 'mcq' ? 'Multiple Choice' : 'True or False'}
          </span>
          {currentQ.topicTag && (
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
              {currentQ.topicTag}
            </span>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {(currentQ.options || ['True', 'False']).map((opt: string, optIdx: number) => {
            const isSelected = answers[currentQ.id] === opt;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectAnswer(currentQ.id, opt)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{opt}</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {currentIdx < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span>Submit Assessment</span>
          </button>
        )}
      </div>
    </div>
  );
};
