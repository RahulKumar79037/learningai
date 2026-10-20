import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  AlertCircle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  X,
  Layers,
} from 'lucide-react';
import api from '../../api/client';
import { useFocusTimer } from '../../context/FocusTimerContext';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const StudyPlannerPage: React.FC = () => {
  const [plan, setPlan] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New task modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskMins, setTaskMins] = useState(30);
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskSubjectId, setTaskSubjectId] = useState('');

  // Generate plan modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planTitle, setPlanTitle] = useState('Foundational Computer Science Sprint');
  const [dailyMins, setDailyMins] = useState(90);
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  // Focus timer context
  const { secondsLeft, isRunning, mode, totalDurationMinutes, startTimer, pauseTimer, resetTimer, setTimerMode, recordCompletedSession } = useFocusTimer();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        api.get('/planner'),
        api.get('/curriculum/subjects'),
      ]);

      if (pRes.data?.success) {
        setPlan(pRes.data.data.plan);
        setTasks(pRes.data.data.tasks || []);
      }
      if (sRes.data?.success) {
        setSubjects(sRes.data.data.subjects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await api.patch(`/planner/tasks/${taskId}/toggle`);
      if (res.data?.success) {
        setTasks(prev => prev.map(t => (t._id === taskId ? res.data.data.task : t)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/planner/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const res = await api.post('/planner/tasks', {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        priority: taskPriority,
        estimatedMinutes: taskMins,
        deadline: taskDeadline || undefined,
        subjectId: taskSubjectId || undefined,
      });

      if (res.data?.success) {
        setTasks(prev => [res.data.data.task, ...prev]);
        setIsTaskModalOpen(false);
        setTaskTitle('');
        setTaskDesc('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/planner/generate', {
        title: planTitle,
        dailyTargetMinutes: dailyMins,
        weeklyTargetHours: weeklyHours,
        selectedSubjects: selectedSubs,
      });

      if (res.data?.success) {
        setPlan(res.data.data.plan);
        setIsPlanModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const timerMins = Math.floor(secondsLeft / 60);
  const timerSecs = secondsLeft % 60;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Personalized Study Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build realistic study schedules balanced with daily focus targets, deadlines, and task priorities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Generate Study Plan
          </button>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Active Plan Banner & Pomodoro Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Study Plan Overview (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
              <span className="uppercase tracking-wider">Active Curriculum Schedule</span>
              <span>{plan?.startDate} → {plan?.endDate}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {plan?.title || 'Comprehensive Computer Science Mastery'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Tailored study trajectory prioritizing algorithmic problem solving, database normalization, and operating system concepts.
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Daily Target</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {plan?.dailyTargetMinutes || 90}m
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Weekly Commitment</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {plan?.weeklyTargetHours || 10}h
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Tasks Progress</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                  {tasks.filter(t => t.completed).length} / {tasks.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Focus Timer Widget (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between text-center">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-4">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-indigo-500" /> Focus Timer
              </span>
              <span className="capitalize text-slate-400">{mode.replace('_', ' ')}</span>
            </div>

            <div className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white my-3">
              {timerMins.toString().padStart(2, '0')}:{timerSecs.toString().padStart(2, '0')}
            </div>

            <div className="flex justify-center gap-1 text-[11px] mb-4">
              <button
                onClick={() => setTimerMode('pomodoro')}
                className={`px-2 py-1 rounded ${mode === 'pomodoro' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
              >
                25m
              </button>
              <button
                onClick={() => setTimerMode('short_break')}
                className={`px-2 py-1 rounded ${mode === 'short_break' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
              >
                5m
              </button>
              <button
                onClick={() => setTimerMode('long_break')}
                className={`px-2 py-1 rounded ${mode === 'long_break' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
              >
                15m
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={resetTimer}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {isRunning ? (
              <button
                onClick={pauseTimer}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            ) : (
              <button
                onClick={startTimer}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-4 h-4" /> Start Focus
              </button>
            )}
            <button
              onClick={() => recordCompletedSession('Focus timer session logged')}
              className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              title="Record Session"
            >
              Log
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" /> Study Tasks & Deadlines
          </h3>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No study tasks created yet. Click "Add Task" to organize your learning goals.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="py-3.5 flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task._id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                    title={task.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className={`capitalize font-semibold ${
                        task.priority === 'high' ? 'text-rose-600' : task.priority === 'medium' ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <span>·</span>
                      <span>{task.estimatedMinutes} mins</span>
                      {task.deadline && (
                        <>
                          <span>·</span>
                          <span>Due: {task.deadline}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Study Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 3 Graph DFS cycle problems"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task details and objectives..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={taskMins}
                    onChange={(e) => setTaskMins(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Deadline Date (Optional)
                </label>
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Generate Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Generate Study Plan
              </h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGeneratePlan} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Daily Goal (Mins)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="360"
                    value={dailyMins}
                    onChange={(e) => setDailyMins(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Weekly Hours
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="40"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Activate Study Plan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
