import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, CheckCircle, ArrowRight, Search } from 'lucide-react';
import api from '../../api/client';
import { ListSkeleton } from '../../components/common/LoadingSkeleton';

export const SubjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/curriculum/subjects/${slug}`)
      .then(res => {
        if (res.data?.success) {
          setSubject(res.data.data.subject);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <ListSkeleton rows={6} />;
  if (!subject) return <div className="text-center py-12">Subject not found.</div>;

  const filteredTopics = (subject.topics || []).filter((t: any) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <NavLink
        to="/curriculum"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All Subjects
      </NavLink>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs mb-2">
              {subject.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {subject.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {subject.description}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {subject.topics?.length || 0}
            </span>
            <p className="text-xs text-slate-400">Total Modules</p>
          </div>
        </div>
      </div>

      {/* Search Modules Filter */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course Syllabus & Modules</h2>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter modules..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {filteredTopics.map((topic: any, index: number) => (
          <NavLink
            key={topic._id}
            to={`/curriculum/${subject.slug}/${topic.slug}`}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-500/80 hover:shadow-md transition-all flex items-start gap-4 group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {topic.title}
                </h3>
                <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {topic.estimatedMinutes} mins
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {topic.summary || topic.definition}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                <span>{topic.interviewQuestions?.length || 0} Interview Questions</span>
                <span>·</span>
                <span>{topic.examQuestions?.length || 0} University Exam Questions</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 self-center" />
          </NavLink>
        ))}
      </div>
    </div>
  );
};
