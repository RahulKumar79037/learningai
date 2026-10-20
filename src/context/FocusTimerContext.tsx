import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

interface FocusTimerContextType {
  secondsLeft: number;
  isRunning: boolean;
  mode: 'pomodoro' | 'short_break' | 'long_break';
  totalDurationMinutes: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (m: 'pomodoro' | 'short_break' | 'long_break') => void;
  recordCompletedSession: (notes?: string) => Promise<void>;
}

const FocusTimerContext = createContext<FocusTimerContextType | undefined>(undefined);

export const FocusTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'pomodoro' | 'short_break' | 'long_break'>('pomodoro');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      // Auto-record session if it was a pomodoro study block
      if (mode === 'pomodoro') {
        recordCompletedSession('Completed 25-minute Pomodoro study block');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode]);

  const setTimerMode = (m: 'pomodoro' | 'short_break' | 'long_break') => {
    setMode(m);
    setIsRunning(false);
    let mins = 25;
    if (m === 'short_break') mins = 5;
    if (m === 'long_break') mins = 15;
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const recordCompletedSession = async (notes?: string) => {
    try {
      await api.post('/planner/sessions', {
        durationMinutes,
        sessionType: 'focus_timer',
        notes: notes || `Logged ${durationMinutes} minutes focus time`,
      });
    } catch (err) {
      console.warn('Failed to record session:', err);
    }
  };

  return (
    <FocusTimerContext.Provider
      value={{
        secondsLeft,
        isRunning,
        mode,
        totalDurationMinutes: durationMinutes,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimerMode,
        recordCompletedSession,
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
};

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (!context) throw new Error('useFocusTimer must be used within FocusTimerProvider');
  return context;
};
