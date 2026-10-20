import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, FileText, Layers, HelpCircle, FileUp, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/client';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    subjects: any[];
    topics: any[];
    notes: any[];
    decks: any[];
    quizzes: any[];
    documents: any[];
    tasks: any[];
  }>({
    subjects: [],
    topics: [],
    notes: [],
    decks: [],
    quizzes: [],
    documents: [],
    tasks: [],
  });
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ subjects: [], topics: [], notes: [], decks: [], quizzes: [], documents: [], tasks: [] });
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      api.get(`/search?q=${encodeURIComponent(query)}`)
        .then(res => {
          if (res.data?.success) {
            setResults(res.data.data.results);
            setTotalCount(res.data.data.totalCount);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, modules, notes, decks, quizzes..."
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {query.trim().length >= 2 && totalCount === 0 && !loading && (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p className="text-sm">No educational resources match "{query}".</p>
              <p className="text-xs text-slate-400 mt-1">Try keywords like "Java", "Tree", "SQL", or "Virtual Memory".</p>
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="py-6 px-2 text-center text-slate-400 text-xs">
              Type at least 2 characters to search across curriculum modules, notes, flashcards, and quizzes.
            </div>
          )}

          {/* Subjects */}
          {results.subjects.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Subjects
              </h4>
              <div className="space-y-1">
                {results.subjects.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.snippet}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Modules */}
          {results.topics.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Curriculum Modules
              </h4>
              <div className="space-y-1">
                {results.topics.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.snippet}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Notes */}
          {results.notes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-violet-500" /> Study Notes
              </h4>
              <div className="space-y-1">
                {results.notes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.snippet}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flashcard Decks */}
          {results.decks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-emerald-500" /> Flashcard Decks
              </h4>
              <div className="space-y-1">
                {results.decks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">{item.snippet}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {results.quizzes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Quizzes
              </h4>
              <div className="space-y-1">
                {results.quizzes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">{item.snippet}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
