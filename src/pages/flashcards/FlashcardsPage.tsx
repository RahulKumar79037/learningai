import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Sparkles,
  BookOpen,
  Trash2,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import api from '../../api/client';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const FlashcardsPage: React.FC = () => {
  const [decks, setDecks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [cardCount, setCardCount] = useState(6);
  const [topicsForSub, setTopicsForSub] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');

  const navigate = useNavigate();

  const fetchDecks = () => {
    setLoading(true);
    api.get('/flashcards/decks')
      .then(res => {
        if (res.data?.success) setDecks(res.data.data.decks);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDecks();
    api.get('/curriculum/subjects')
      .then(res => {
        if (res.data?.success) setSubjects(res.data.data.subjects);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedSubId) {
      setTopicsForSub([]);
      setSelectedTopicId('');
      return;
    }
    const sub = subjects.find(s => s._id === selectedSubId);
    if (sub) {
      api.get(`/curriculum/subjects/${sub.slug}`)
        .then(res => {
          if (res.data?.success) setTopicsForSub(res.data.data.subject.topics || []);
        })
        .catch(err => console.error(err));
    }
  }, [selectedSubId, subjects]);

  const handleGenerateAiDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGenerating(true);

    try {
      const res = await api.post('/flashcards/decks/generate', {
        subjectId: selectedSubId || undefined,
        topicId: selectedTopicId || undefined,
        cardCount,
      });

      if (res.data?.success) {
        setIsAiModalOpen(false);
        navigate(`/flashcards/${res.data.data.deck._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateManualDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    try {
      const res = await api.post('/flashcards/decks', {
        title: manualTitle.trim(),
        description: manualDesc.trim(),
      });
      if (res.data?.success) {
        setIsManualModalOpen(false);
        setManualTitle('');
        setManualDesc('');
        fetchDecks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDeck = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this flashcard deck and all its cards?')) return;
    try {
      await api.delete(`/flashcards/decks/${id}`);
      setDecks(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Spaced Repetition Flashcards
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Master high-yield computer science concepts with automated Leitner interval scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Generate Deck with AI
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Deck
          </button>
        </div>
      </div>

      {/* Decks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : decks.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Flashcard Decks Yet"
          description="Generate an automated Leitner flashcard deck for any Computer Science subject with AI."
          actionText="Generate Deck with AI"
          onAction={() => setIsAiModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div
              key={deck._id}
              onClick={() => navigate(`/flashcards/${deck._id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {deck.cardCount} Cards
                  </span>
                  <button
                    onClick={(e) => handleDeleteDeck(deck._id, e)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete Deck"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 line-clamp-1">
                  {deck.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {deck.description || 'Master fundamental concepts and high-yield interview questions.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {deck.learnedCount || 0} Learned
                  </span>
                  <span>·</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {deck.dueCount || 0} Due
                  </span>
                </div>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Study <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> AI Flashcard Generator
              </h3>
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerateAiDeck} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Subject
                </label>
                <select
                  value={selectedSubId}
                  onChange={(e) => setSelectedSubId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {selectedSubId && topicsForSub.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Module (Optional)
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="">-- All Modules in Subject --</option>
                    {topicsForSub.map(t => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Number of Cards: {cardCount}
                </label>
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={cardCount}
                  onChange={(e) => setCardCount(Number(e.target.value))}
                  className="w-full accent-indigo-600"
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
                      <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Cards...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Flashcard Deck
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Deck Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Flashcard Deck</h3>
              <button onClick={() => setIsManualModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualDeck} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Deck Title
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Operating System Semaphores & Synchronization"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="Key review definitions and equations..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Create Deck
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
