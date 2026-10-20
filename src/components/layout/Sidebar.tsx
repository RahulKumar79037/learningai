import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  FileText,
  Layers,
  HelpCircle,
  FileUp,
  Calendar,
  BarChart3,
  ShieldAlert,
  Flame,
  Timer,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFocusTimer } from '../../context/FocusTimerContext';

interface SidebarProps {
  onOpenFocusTimer: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenFocusTimer, onCloseMobile }) => {
  const { user } = useAuth();
  const { secondsLeft, isRunning } = useFocusTimer();

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Curriculum', path: '/curriculum', icon: BookOpen },
    { name: 'AI Tutor', path: '/tutor', icon: Bot },
    { name: 'Study Notes', path: '/notes', icon: FileText },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'AI Quizzes', path: '/quiz', icon: HelpCircle },
    { name: 'Documents & RAG', path: '/documents', icon: FileUp },
    { name: 'Study Planner', path: '/planner', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Console', path: '/admin', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <NavLink to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            LC
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              Learning Companion
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Computer Science AI Platform</p>
          </div>
        </NavLink>
      </div>

      {/* Focus Timer Bar in Sidebar */}
      <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/50 flex items-center justify-between">
        <button
          onClick={onOpenFocusTimer}
          className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          title="Open Focus Pomodoro Timer"
        >
          <Timer className={`w-4 h-4 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
          <span>Focus Timer</span>
          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
            {formatTimer(secondsLeft)}
          </span>
        </button>
        {user && (
          <div className="flex items-center gap-1 text-xs text-amber-400 font-medium" title="Current Daily Streak">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{user.studyStreak || 1}d</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Status Bar */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/60 transition-colors group"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-900/60 text-indigo-300 font-semibold flex items-center justify-center text-xs border border-indigo-700/50">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
              {user?.name || 'Student'}
            </p>
            <p className="text-[11px] text-slate-400 truncate capitalize">
              {user?.role} · Goal: {user?.dailyStudyGoalMinutes || 60}m
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
