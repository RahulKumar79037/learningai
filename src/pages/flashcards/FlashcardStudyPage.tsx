import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import api from '../../api/client';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const FlashcardStudyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  // New card form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [addCardError, setAddCardError] = useState<string | null>(null);

  const fetchDeck = () => {
    setLoading(true);
    api.get(`/flashcards/decks/${id}`)
      .then(res => {
        if (res.data?.success) {
          setDeck(res.data.data.deck);
          setCards(res.data.data.cards || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeck();
  }, [id]);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleRateCard = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    try {
      const res = await api.post(`/flashcards/cards/${currentCard._id}/review`, { rating });
      if (res.data?.success) {
        // Update local card state
        setCards(prev => prev.map((c, i) => (i === currentIndex ? res.data.data.card : c)));
        // Advance to next card
        if (currentIndex < cards.length - 1) {
          handleNext();
        } else {
          setIsFlipped(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddCardModal = () => {
    setAddCardError(null);
    setNewQuestion('');
    setNewAnswer('');
    setNewExplanation('');
    setNewExample('');
    setNewDifficulty('medium');
    setIsAddCardOpen(true);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCardError(null);

    const question = newQuestion.trim();
    const answer = newAnswer.trim();

    if (!question) {
      setAddCardError('Please enter a question (front) for the flashcard.');
      return;
    }
    if (!answer) {
      setAddCardError('Please enter the correct answer (back) for the flashcard.');
      return;
    }

    setIsSavingCard(true);

    try {
      const res = await api.post(`/flashcards/decks/${id}/cards`, {
        question,
        answer,
        explanation: newExplanation.trim(),
        example: newExample.trim(),
        difficulty: newDifficulty,
      });

      if (res.data?.success && res.data.data.card) {
        const savedCard = res.data.data.card;
        setCards(prev => {
          const updated = [...prev, savedCard];
          // If this was the first card added, view it immediately
          if (prev.length === 0) {
            setCurrentIndex(0);
          }
          return updated;
        });

        if (deck) {
          setDeck((prev: any) => prev ? { ...prev, cardCount: (prev.cardCount || 0) + 1 } : prev);
        }

        setIsAddCardOpen(false);
        setNewQuestion('');
        setNewAnswer('');
        setNewExplanation('');
        setNewExample('');
        setNewDifficulty('medium');
        setIsFlipped(false);
      } else {
        setAddCardError(res.data?.error || 'Failed to save card. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setAddCardError(err.response?.data?.error || err.message || 'Failed to save card. Please check your connection.');
    } finally {
      setIsSavingCard(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <CardSkeleton />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <Layers className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Deck Not Found</h3>
        <p className="text-xs text-slate-500">The requested flashcard deck could not be found or you do not have permission to view it.</p>
        <NavLink
          to="/flashcards"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Decks
        </NavLink>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <NavLink
          to="/flashcards"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Decks
        </NavLink>

        <div className="flex items-center gap-2">
          {cards.length > 1 && (
            <button
              onClick={handleShuffle}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Shuffle Deck"
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle
            </button>
          )}
          <button
            onClick={handleOpenAddCardModal}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </button>
        </div>
      </div>

      {/* Main Deck Area: Empty State OR Flashcard Review */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-10 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{deck.title}</h2>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">This deck has no cards yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
              Create your first flashcard with a question and answer to start practicing active recall.
            </p>
          </div>
          <button
            onClick={handleOpenAddCardModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add First Card
          </button>
        </div>
      ) : (
        <>
          {/* Progress & Deck Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{deck.title}</span>
              <span>Card {currentIndex + 1} of {cards.length}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={handleFlip}
            className="w-full min-h-[360px] cursor-pointer select-none rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-lg transition-all flex flex-col justify-between text-center relative overflow-hidden group"
          >
            {/* Leitner Box Level Badge */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-semibold">
                Leitner Box {currentCard?.box || 0}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                Click card to flip
              </span>
            </div>

            {/* Card Content */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 block">
                    Question
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentCard?.question}
                  </h2>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 block">
                      Correct Answer
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {currentCard?.answer}
                    </p>
                  </div>

                  {currentCard?.explanation && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Explanation: </span>
                      {currentCard.explanation}
                    </div>
                  )}

                  {currentCard?.example && (
                    <div className="p-3 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto">
                      <code>{currentCard.example}</code>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="text-[11px] text-slate-400">
              Reviewed {currentCard?.reviewCount || 0} times
            </div>
          </div>

          {/* Spaced Repetition Rating Buttons */}
          {isFlipped ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-center text-slate-500 uppercase tracking-wider">
                Rate your recall to schedule next review:
              </p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRateCard('again')}
                  className="py-2.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                >
                  Again (Today)
                </button>
                <button
                  onClick={() => handleRateCard('hard')}
                  className="py-2.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-semibold border border-amber-200 dark:border-amber-900 transition-colors cursor-pointer"
                >
                  Hard (+1d)
                </button>
                <button
                  onClick={() => handleRateCard('good')}
                  className="py-2.5 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-semibold border border-indigo-200 dark:border-indigo-900 transition-colors cursor-pointer"
                >
                  Good (+4d)
                </button>
                <button
                  onClick={() => handleRateCard('easy')}
                  className="py-2.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 dark:border-emerald-900 transition-colors cursor-pointer"
                >
                  Easy (+8d)
                </button>
              </div>
            </div>
          ) : (
            /* Prev / Next controls */
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={handleFlip}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Reveal Answer
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Card Modal - Available for both empty and existing decks */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Add Card to Deck
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCardOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addCardError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addCardError}</span>
              </div>
            )}

            <form onSubmit={handleAddCard} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Question (Front) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => {
                    setNewQuestion(e.target.value);
                    if (addCardError) setAddCardError(null);
                  }}
                  placeholder="e.g. What is the time complexity of QuickSort average case?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Correct Answer (Back) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={newAnswer}
                  onChange={(e) => {
                    setNewAnswer(e.target.value);
                    if (addCardError) setAddCardError(null);
                  }}
                  placeholder="e.g. O(n log n) with balanced partitioning."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Explanation (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Additional context or textbook rationale..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Code Snippet / Example (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="Code demonstration or formula..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setNewDifficulty(diff)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        newDifficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  disabled={isSavingCard}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCard}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSavingCard ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Card...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Card</span>
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
