import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../../api/client';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#f43f5e'];

export const AnalyticsPage: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get('/dashboard/trends'), api.get('/dashboard')])
      .then(([tRes, dRes]) => {
        if (tRes.data?.success) setTrends(tRes.data.data);
        if (dRes.data?.success) setDashboard(dRes.data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const { last7Days = [], quizAttempts = [] } = trends || {};
  const { stats, subjectProgress = [], weakTopics = [], recommendations = [] } = dashboard || {};

  const pieData = subjectProgress.map((sub: any) => ({
    name: sub.name,
    value: sub.completedCount || 0,
  })).filter((s: any) => s.value > 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Learning Analytics & Mastery
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quantitative metrics derived from your completed modules, focus sessions, and server-graded quizzes.
        </p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Focus Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.totalStudyMinutes || 0} mins
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across study modules & focus timer sessions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Assessment Score</span>
            <Award className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.avgQuizPercentage || 0}%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculated over {stats?.totalQuizzesTaken || 0} quiz attempts
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Diagnosed Weak Topics</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {weakTopics?.length || 0}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Targeted for priority review & practice
          </p>
        </div>
      </div>

      {/* Two Column Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Focus Minutes (Last 7 Days) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Daily Study Time (Last 7 Days)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Minutes logged per day via focus timers and completed modules
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Quiz Score Progression */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Assessment Score Progression
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Percentage scores on diagnostic tests
          </p>

          {quizAttempts.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizAttempts}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              Take your first diagnostic quiz to plot score progression trends.
            </div>
          )}
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" /> Subject Curriculum Mastery
        </h3>

        <div className="space-y-4">
          {subjectProgress.map((sub: any) => (
            <div key={sub.subjectId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">{sub.name}</span>
                <span className="text-indigo-600 dark:text-indigo-400">{sub.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{sub.completedCount} of {sub.totalModules} modules completed</span>
                <span>{sub.totalStudyMinutes} mins invested</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
