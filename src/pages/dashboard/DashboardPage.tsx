import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Bot,
  FileText,
  Layers,
  FileUp,
  AlertTriangle,
  Calendar,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { CardSkeleton, ListSkeleton } from '../../components/common/LoadingSkeleton';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = () => {
    setLoading(true);
    api.get('/dashboard')
      .then((res) => {
        if (res.data?.success) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load dashboard data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      await api.patch(`/planner/tasks/${taskId}/toggle`);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <ListSkeleton rows={3} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-rose-600 dark:text-rose-400 font-medium mb-3">{error || 'Unable to load dashboard.'}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, activePlan, pendingTasks, completedTasks, subjectProgress, recommendations, weakTopics, recentActivities } = data;

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'Student'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your progress across 8 Computer Science subjects and personalized study goals.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <NavLink
            to="/tutor"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Bot className="w-4 h-4" /> Ask AI Tutor
          </NavLink>
          <NavLink
            to="/documents"
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileUp className="w-4 h-4 text-indigo-500" /> Upload Book / Notes
          </NavLink>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.studyStreak}</span>
            <span className="text-xs text-slate-500">consecutive days</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Keep learning daily to maintain streak
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Focus</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.todayStudyMinutes}m</span>
            <span className="text-xs text-slate-500">/ {user?.dailyStudyGoalMinutes || 60}m goal</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((stats.todayStudyMinutes / (user?.dailyStudyGoalMinutes || 60)) * 100))}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Quiz Mastery</span>
            <HelpCircle className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avgQuizPercentage}%</span>
            <span className="text-xs text-slate-500">avg score ({stats.totalQuizzesTaken} tests)</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            {stats.totalQuizzesTaken > 0 ? 'Verified on server-graded assessments' : 'Attempt a quiz to generate diagnostic metrics'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pendingTasksCount}</span>
            <span className="text-xs text-slate-500">pending · {stats.completedTasksCount} done</span>
          </div>
          <div className="mt-3">
            <NavLink to="/planner" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
              Open Study Planner <ArrowRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Recommendations & Weak Topics Alert Banner */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Personalized Recommendations (From Real Records)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec: any, idx: number) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-950/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                      {rec.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {rec.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{rec.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{rec.reason}</p>
                </div>
                <NavLink
                  to={rec.actionUrl}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-auto"
                >
                  Start Action <ArrowRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Plan & Tasks vs Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Tasks (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" /> Today's Learning Tasks
                </h3>
                {activePlan && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Plan: <span className="font-semibold text-slate-700 dark:text-slate-300">{activePlan.title}</span>
                  </p>
                )}
              </div>
              <NavLink to="/planner" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All Tasks →
              </NavLink>
            </div>

            {pendingTasks && pendingTasks.length > 0 ? (
              <div className="space-y-2.5">
                {pendingTasks.map((t: any) => (
                  <div
                    key={t._id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition-colors"
                  >
                    <button
                      onClick={() => handleToggleTask(t._id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                      title="Mark task completed"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{t.title}</p>
                      {t.description && <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                        <span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">{t.priority} Priority</span>
                        <span>·</span>
                        <span>{t.estimatedMinutes} mins est.</span>
                        {t.deadline && (
                          <>
                            <span>·</span>
                            <span>Due: {t.deadline}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending study tasks! You are all caught up for today.
              </div>
            )}
          </div>

          {/* Computer Science Curriculum Progress */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" /> CS Curriculum Progress
              </h3>
              <NavLink to="/curriculum" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Explore All 8 Subjects →
              </NavLink>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {subjectProgress.map((sub: any) => (
                <NavLink
                  key={sub.subjectId}
                  to={`/curriculum/${sub.slug}`}
                  className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-400 transition-colors group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {sub.name}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {sub.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{sub.completedCount} of {sub.totalModules} modules</span>
                    <span>{sub.totalStudyMinutes}m studied</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weak Topics & Recent Learning Activity (1 col) */}
        <div className="space-y-6">
          {/* Weak Topics Analysis */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Focus Areas & Weak Topics
            </h3>
            {weakTopics && weakTopics.length > 0 ? (
              <div className="space-y-2">
                {weakTopics.map((wt: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{wt.topic}</span>
                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                      {wt.count} review{wt.count > 1 ? 's' : ''} needed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Great job! No weak topic bottlenecks detected in recent quiz evaluations. Take a diagnostic test to identify challenge areas.
              </p>
            )}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <NavLink to="/quiz" className="w-full text-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 block transition-colors">
                Generate Diagnostic Quiz
              </NavLink>
            </div>
          </div>

          {/* Recent Learning Activities Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Recent Activities
            </h3>
            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((act: any) => (
                  <div key={act._id} className="text-xs border-l-2 border-indigo-500 pl-3 py-0.5">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{act.title}</p>
                    {act.details && <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{act.details}</p>}
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No activity logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
