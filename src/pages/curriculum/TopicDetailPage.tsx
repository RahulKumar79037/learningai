import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Code2,
  AlertTriangle,
  HelpCircle,
  GraduationCap,
  Sparkles,
  Bot,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import api from '../../api/client';
import { MarkdownViewer } from '../../components/common/MarkdownViewer';
import { ListSkeleton } from '../../components/common/LoadingSkeleton';

export const TopicDetailPage: React.FC = () => {
  const { subjectSlug, topicSlug } = useParams<{ subjectSlug: string; topicSlug: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!subjectSlug || !topicSlug) return;
    setLoading(true);
    api.get(`/curriculum/subjects/${subjectSlug}/topics/${topicSlug}`)
      .then(res => {
        if (res.data?.success) {
          setTopic(res.data.data.topic);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [subjectSlug, topicSlug]);

  const handleMarkComplete = async () => {
    if (!subjectSlug || !topicSlug) return;
    setActionLoading(true);
    try {
      await api.post(`/curriculum/subjects/${subjectSlug}/topics/${topicSlug}/complete`);
      setCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  if (loading) return <ListSkeleton rows={8} />;
  if (!topic) return <div className="text-center py-12">Module not found.</div>;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <NavLink
          to={`/curriculum/${subjectSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {topic.subject?.name || 'Subject'}
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink
            to={`/tutor`}
            state={{ initialQuestion: `Can you explain ${topic.title} in detail with examples?` }}
            className="px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" /> Discuss with AI Tutor
          </NavLink>

          <button
            onClick={handleMarkComplete}
            disabled={completed || actionLoading}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              completed
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{completed ? 'Completed ✓' : actionLoading ? 'Saving...' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>

      {/* Main Title & Estimated Time */}
      <div>
        <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider mb-2">
          <span>{topic.subject?.name}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {topic.estimatedMinutes} Mins Study Time
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {topic.title}
        </h1>
      </div>

      {/* 1. Formal Definition Card */}
      <section className="bg-indigo-50/60 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-2">
          Academic Definition
        </h2>
        <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {topic.definition}
        </p>
      </section>

      {/* 2. Detailed Explanation */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Detailed Explanation & Principles
        </h2>
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
          <p>{topic.detailedExplanation}</p>
        </div>

        {/* Types & Classifications */}
        {topic.typesAndClassifications && topic.typesAndClassifications.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Types & Classifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topic.typesAndClassifications.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complexity Analysis Badge */}
        {topic.complexityAnalysis && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Asymptotic Complexity Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topic.complexityAnalysis.timeComplexity && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Time Complexity</span>
                  <div className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {topic.complexityAnalysis.timeComplexity}
                  </div>
                </div>
              )}
              {topic.complexityAnalysis.spaceComplexity && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Space Complexity</span>
                  <div className="text-base font-mono font-bold text-violet-600 dark:text-violet-400 mt-0.5">
                    {topic.complexityAnalysis.spaceComplexity}
                  </div>
                </div>
              )}
            </div>
            {topic.complexityAnalysis.explanation && (
              <p className="text-xs text-slate-500 mt-2">{topic.complexityAnalysis.explanation}</p>
            )}
          </div>
        )}
      </section>

      {/* 3. Code Examples */}
      {topic.codeExamples && topic.codeExamples.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-indigo-600" /> Implementation Code Demonstration
          </h2>
          <div className="space-y-6">
            {topic.codeExamples.map((ex: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300">
                  <span className="font-semibold text-indigo-400">{ex.title}</span>
                  <button
                    onClick={() => copyCode(ex.code, idx)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCodeIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeIdx === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
                  <pre><code>{ex.code}</code></pre>
                </div>
                {ex.explanation && (
                  <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-slate-400 font-sans text-xs">
                    <span className="font-semibold text-slate-300">Explanation: </span>{ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Common Mistakes */}
      {topic.commonMistakes && topic.commonMistakes.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Common Misconceptions & Mistakes
          </h2>
          <ul className="space-y-2">
            {topic.commonMistakes.map((m: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. College Examination Questions */}
      {topic.examQuestions && topic.examQuestions.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> University Examination Questions
          </h2>
          <div className="space-y-4">
            {topic.examQuestions.map((q: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-900 dark:text-white">Q{idx + 1}. {q.question}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    [{q.marks} Marks]
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Answer Key Guide: </span>
                  {q.solutionGuide}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Interview Preparation Questions */}
      {topic.interviewQuestions && topic.interviewQuestions.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-violet-600" /> Technical Interview Questions
          </h2>
          <div className="space-y-4">
            {topic.interviewQuestions.map((q: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: {q.question}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">A: {q.answer}</p>
                {q.tips && (
                  <p className="text-[11px] text-violet-600 dark:text-violet-400 italic">
                    💡 Interview Tip: {q.tips}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Short Revision Notes */}
      {topic.revisionNotes && topic.revisionNotes.length > 0 && (
        <section className="bg-indigo-50/40 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 2-Minute Quick Revision Notes
          </h2>
          <ul className="space-y-2">
            {topic.revisionNotes.map((note: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
