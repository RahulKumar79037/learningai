import React from 'react';
import { Play, Pause, RotateCcw, X, CheckCircle, Coffee, Brain } from 'lucide-react';
import { useFocusTimer } from '../../context/FocusTimerContext';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({ isOpen, onClose }) => {
  const { secondsLeft, isRunning, mode, totalDurationMinutes, startTimer, pauseTimer, resetTimer, setTimerMode, recordCompletedSession } = useFocusTimer();

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((totalDurationMinutes * 60 - secondsLeft) / (totalDurationMinutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" /> Focus Study Timer
          </h3>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl my-6">
          <button
            onClick={() => setTimerMode('pomodoro')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'pomodoro'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => setTimerMode('short_break')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'short_break'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => setTimerMode('long_break')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'long_break'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Display */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-48 h-48 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                className="stroke-indigo-600 transition-all duration-500 ease-linear"
                strokeWidth="8"
                fill="none"
                strokeDasharray="553"
                strokeDashoffset={553 - (553 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <div className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-medium">
                {mode === 'pomodoro' ? 'Deep Work' : 'Rest Break'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {isRunning ? (
            <button
              onClick={pauseTimer}
              className="px-6 py-3 rounded-full bg-amber-600 text-white font-medium flex items-center gap-2 hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all"
            >
              <Pause className="w-5 h-5" /> Pause
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Play className="w-5 h-5" /> Start Focus
            </button>
          )}

          <button
            onClick={() => {
              recordCompletedSession('Manually logged completed study session');
              onClose();
            }}
            className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
            title="Log Session Now"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
