import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Clock,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';
import api from '../../api/client';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const QuizResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true);
    api.get(`/quizzes/attempts/${attemptId}`)
      .then(res => {
        if (res.data?.success) {
          setAttempt(res.data.data.attempt);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <div className="max-w-2xl mx-auto py-12"><CardSkeleton /></div>;
  if (!attempt) return <div className="text-center py-12">Attempt results not found.</div>;

  const { score, maxScore, percentage, passed, timeSpentSeconds, answers, weakTopicsIdentified, quizTitle, quizId } = attempt;

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <NavLink
          to="/quiz"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Assessments
        </NavLink>

        <NavLink
          to={`/quiz/${quizId}`}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retake Assessment
        </NavLink>
      </div>

      {/* Score Summary Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 ${
        passed
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-100'
          : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-100'
      }`}>
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
            <Award className={`w-5 h-5 ${passed ? 'text-emerald-600' : 'text-rose-600'}`} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {passed ? 'Assessment Passed' : 'Needs Review'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{quizTitle}</h1>
          <p className="text-xs opacity-80">
            Completed in {Math.round(timeSpentSeconds / 60)} minutes · Server-verified evaluation
          </p>
        </div>

        <div className="text-center shrink-0">
          <div className="text-5xl font-black font-mono tracking-tight">{percentage}%</div>
          <div className="text-xs font-semibold mt-1 opacity-80">
            {score} of {maxScore} correct
          </div>
        </div>
      </div>

      {/* Weak Topics Warning Banner */}
      {weakTopicsIdentified && weakTopicsIdentified.length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 p-5">
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Weak Topics Diagnosed
          </h3>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-3">
            Your missed questions indicate these concepts require revision. We have automatically updated your personalized recommendations:
          </p>
          <div className="flex flex-wrap gap-2">
            {weakTopicsIdentified.map((topic: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Question by Question Review */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Question-by-Question Detailed Review
        </h2>

        <div className="space-y-4">
          {answers.map((ans: any, idx: number) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs ${
                ans.isCorrect
                  ? 'border-emerald-200/80 dark:border-emerald-900/30'
                  : 'border-rose-200/80 dark:border-rose-900/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                  ans.isCorrect
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                }`}>
                  {ans.isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {ans.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 leading-relaxed">
                {ans.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                <div className={`p-2.5 rounded-xl border ${
                  ans.isCorrect
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-200'
                }`}>
                  <span className="font-semibold block text-[10px] uppercase tracking-wider mb-0.5 opacity-70">
                    Your Answer
                  </span>
                  {ans.studentAnswer || '(No answer provided)'}
                </div>

                {!ans.isCorrect && (
                  <div className="p-2.5 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-200">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider mb-0.5 opacity-70">
                      Correct Answer
                    </span>
                    {ans.correctAnswer}
                  </div>
                )}
              </div>

              {ans.explanation && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Explanation: </span>
                  {ans.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
