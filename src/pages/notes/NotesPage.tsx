import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  Trash2,
  Calendar,
  Tag,
  ArrowRight,
  BookOpen,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import api from '../../api/client';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { normalizeAcademicMarkdown } from '../../../server/src/utils/academicMarkdown.js';

function formatNotePreview(content: string): string {
  if (!content) return '';
  const normalized = normalizeAcademicMarkdown(content);
  return normalized
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // AI Generator Modal state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genSubjectId, setGenSubjectId] = useState('');
  const [genTopicId, setGenTopicId] = useState('');
  const [genCustomTopic, setGenCustomTopic] = useState('');
  const [topicsForSubject, setTopicsForSubject] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchNotes = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (selectedSubject) query.append('subjectId', selectedSubject);
    if (search) query.append('search', search);

    api.get(`/notes?${query.toString()}`)
      .then(res => {
        if (res.data?.success) {
          setNotes(res.data.data.notes);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedSubject]);

  useEffect(() => {
    api.get('/curriculum/subjects')
      .then(res => {
        if (res.data?.success) setSubjects(res.data.data.subjects);
      })
      .catch(err => console.error(err));
  }, []);

  // When subject changes in generator modal, fetch its modules
  useEffect(() => {
    if (!genSubjectId) {
      setTopicsForSubject([]);
      setGenTopicId('');
      return;
    }
    const sub = subjects.find(s => s._id === genSubjectId);
    if (sub) {
      api.get(`/curriculum/subjects/${sub.slug}`)
        .then(res => {
          if (res.data?.success) {
            setTopicsForSubject(res.data.data.subject.topics || []);
          }
        })
        .catch(err => console.error(err));
    }
  }, [genSubjectId, subjects]);

  const handleGenerateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError(null);
    setGenerating(true);

    try {
      const res = await api.post('/notes/generate', {
        subjectId: genSubjectId || undefined,
        topicId: genTopicId || undefined,
        customTopic: genCustomTopic || undefined,
      });

      if (res.data?.success) {
        setIsGeneratorOpen(false);
        navigate(`/notes/${res.data.data.note._id}`);
      }
    } catch (err: any) {
      setGenError(err.response?.data?.error || err.message || 'Note generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this study note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Study Notes & Revisions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, or automatically synthesize structured academic revision notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Generate with AI
          </button>
          <NavLink
            to="/notes/new"
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Note
          </NavLink>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchNotes()}
            placeholder="Search notes content and tags..."
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Study Notes Found"
          description="Synthesize revision notes with the AI generator or create your own custom markdown notes."
          actionText="Generate Notes with AI"
          onAction={() => setIsGeneratorOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => navigate(`/notes/${note._id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {note.isAiGenerated ? 'AI-Synthesized' : 'Custom Note'}
                  </span>
                  <button
                    onClick={(e) => handleDeleteNote(note._id, e)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-1">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {formatNotePreview(note.content)}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Note <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Notes Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> AI Study Notes Generator
              </h3>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {genError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{genError}</span>
              </div>
            )}

            <form onSubmit={handleGenerateNotes} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Subject (Optional)
                </label>
                <select
                  value={genSubjectId}
                  onChange={(e) => setGenSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {genSubjectId && topicsForSubject.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Specific Module
                  </label>
                  <select
                    value={genTopicId}
                    onChange={(e) => setGenTopicId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="">-- Entire Subject or Choose Module --</option>
                    {topicsForSubject.map(t => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Or Custom Topic Name
                </label>
                <input
                  type="text"
                  value={genCustomTopic}
                  onChange={(e) => setGenCustomTopic(e.target.value)}
                  placeholder="e.g. Red-Black Tree Balancing & Rotations"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Comprehensive Notes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Study Notes
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
