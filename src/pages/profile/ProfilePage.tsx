import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Key,
  Database,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Shield,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyStudyGoalMinutes || 60);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Change password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // System Health
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    api.get('/health')
      .then(res => setHealth(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await api.put('/auth/profile', {
        name,
        dailyStudyGoalMinutes: Number(dailyGoal),
      });

      if (res.data?.success) {
        updateUser(res.data.data.user);
        setProfileMsg('Profile and study goals updated successfully!');
        setTimeout(() => setProfileMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaving(true);
    setPassMsg(null);
    setPassError(null);

    try {
      const res = await api.post('/auth/change-password', {
        currentPassword: currentPass,
        newPassword: newPass,
      });

      if (res.data?.success) {
        setPassMsg('Password updated successfully!');
        setCurrentPass('');
        setNewPass('');
        setTimeout(() => setPassMsg(null), 3000);
      }
    } catch (err: any) {
      setPassError(err.response?.data?.error || err.message || 'Password update failed.');
    } finally {
      setPassSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Profile & Configuration
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal study targets, credentials, and inspect database and AI connectivity.
        </p>
      </div>

      {/* Grid: Profile Settings & Change Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <UserIcon className="w-5 h-5 text-indigo-500" /> Student Profile
          </h2>

          {profileMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Daily Study Goal
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{dailyGoal} Minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="240"
                step="15"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-violet-500" /> Security & Password
          </h2>

          {passMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{passMsg}</span>
            </div>
          )}

          {passError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                New Password (min. 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={passSaving}
              className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* System Architecture & Setup Guide Card */}
      {health && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" /> Platform Infrastructure Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Database Service Status */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-500" /> Database Subsystem
                </span>
                <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                  health.database.connected ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {health.database.type === 'mongodb_atlas' ? 'MongoDB Atlas' : 'Persistent Storage'}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {health.database.message}
              </p>
              {health.database.type !== 'mongodb_atlas' && (
                <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300">
                  <strong>To connect to MongoDB Atlas:</strong> Set <code className="font-mono bg-indigo-100 dark:bg-indigo-900/60 px-1 py-0.5 rounded">MONGODB_URI</code> in your <code className="font-mono">.env</code> file.
                </div>
              )}
            </div>

            {/* Gemini AI Status */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Google Gemini AI
                </span>
                <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                  health.ai.configured ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {health.ai.configured ? 'Operational' : 'Key Required'}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {health.ai.message}
              </p>
              {!health.ai.configured && (
                <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300">
                  <strong>To configure Gemini:</strong> Open <strong>Settings &gt; Secrets</strong> in AI Studio and attach your <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">GEMINI_API_KEY</code>.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
