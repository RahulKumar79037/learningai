import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Timer,
  Flame,
  User as UserIcon,
  LogOut,
  Shield,
  HelpCircle,
  Database,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useFocusTimer } from '../../context/FocusTimerContext';
import api from '../../api/client';

interface NavbarProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
  onOpenFocusTimer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileNav, onOpenSearch, onOpenFocusTimer }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { secondsLeft, isRunning } = useFocusTimer();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    dbType: string;
    dbConnected: boolean;
    geminiConfigured: boolean;
  } | null>(null);

  useEffect(() => {
    api.get('/health')
      .then(res => {
        if (res.data?.status === 'ok') {
          setHealthStatus({
            dbType: res.data.database.type,
            dbConnected: res.data.database.connected,
            geminiConfigured: res.data.ai.configured,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile trigger & Search bar button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors w-48 sm:w-64"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="flex-1 text-left truncate">Search subjects, modules...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Health Indicators */}
        {healthStatus && (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pr-2 border-r border-slate-200 dark:border-slate-800">
            <span
              className="flex items-center gap-1.5"
              title={healthStatus.dbType === 'mongodb_atlas' ? 'Connected to MongoDB Atlas' : 'Running on persistent database storage'}
            >
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                {healthStatus.dbType === 'mongodb_atlas' ? 'MongoDB Atlas' : 'DB Ready'}
              </span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span
              className="flex items-center gap-1"
              title={healthStatus.geminiConfigured ? 'Gemini AI Operational' : 'Gemini API Key pending in Secrets'}
            >
              <Sparkles className={`w-3.5 h-3.5 ${healthStatus.geminiConfigured ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                {healthStatus.geminiConfigured ? 'Gemini 3.8' : 'AI Setup'}
              </span>
            </span>
          </div>
        )}

        {/* Focus Timer Button */}
        <button
          onClick={onOpenFocusTimer}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors"
          title="Open Focus Timer"
        >
          <Timer className={`w-4 h-4 ${isRunning ? 'text-emerald-500 animate-pulse' : 'text-slate-500'}`} />
          <span className="font-mono text-xs">{formatTimer(secondsLeft)}</span>
        </button>

        {/* Streak Counter */}
        {user && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/50"
            title={`${user.studyStreak || 1} day study streak!`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{user.studyStreak || 1}d Streak</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all focus:outline-none"
            aria-label="User profile menu"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-medium text-xs flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-40 text-sm">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {user?.role} Account
                  </span>
                </div>

                <div className="py-1">
                  <NavLink
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Profile & Goals</span>
                  </NavLink>

                  {user?.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-indigo-500" />
                      <span>Admin Console</span>
                    </NavLink>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700/60 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
