import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  HelpCircle,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock,
  Layers,
  Database,
} from 'lucide-react';
import api from '../../api/client';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'documents'>('users');
  const [docs, setDocs] = useState<any[]>([]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, lRes, dRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?q=${encodeURIComponent(userSearch)}`),
        api.get('/admin/logs'),
        api.get('/admin/documents'),
      ]);

      if (sRes.data?.success) setStats(sRes.data.data.stats);
      if (uRes.data?.success) setUsers(uRes.data.data.users);
      if (lRes.data?.success) setAuditLogs(lRes.data.data.logs);
      if (dRes.data?.success) setDocs(dRes.data.data.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userSearch]);

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`);
      if (res.data?.success) {
        setUsers(prev => prev.map(u => (u._id === userId ? { ...u, isActive: res.data.data.user.isActive } : u)));
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to toggle user status.');
    }
  };

  if (loading) return <div className="space-y-6 max-w-5xl mx-auto py-6"><CardSkeleton /><CardSkeleton /></div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <ShieldAlert className="w-4 h-4" /> Administrative Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Platform Management & Moderation
          </h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">Total Users</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.users.total}</span>
            <p className="text-[11px] text-slate-500 mt-1">{stats.users.students} Students · {stats.users.admins} Admins</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">Uploaded Docs</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.content.documentsUploaded}</span>
            <p className="text-[11px] text-slate-500 mt-1">{stats.content.topicsCount} Curriculum Modules</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">Quizzes Completed</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.content.quizzesCompleted}</span>
            <p className="text-[11px] text-slate-500 mt-1">Server graded attempts</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">Total Study Hours</span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.engagement.totalStudyHours}h</span>
            <p className="text-[11px] text-slate-500 mt-1">{stats.engagement.totalConversations} AI Tutor sessions</p>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Document Moderation ({docs.length})
        </button>
      </div>

      {/* Tab 1: User Accounts Table */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400">Showing {users.length} registered accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Streak</th>
                  <th className="px-5 py-3 text-left">Registered</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="px-5 py-3.5 capitalize font-medium">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        u.isActive ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {u.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono">{u.studyStreak || 0}d</td>
                    <td className="px-5 py-3.5 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            u.isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
            Recorded Security & Administrative Actions
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
            {auditLogs.map((log) => (
              <div key={log._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{log.action}</span>
                  <span className="text-slate-400 mx-2">·</span>
                  <span className="text-slate-700 dark:text-slate-300">{log.userEmail || 'System'}</span>
                  {log.details && (
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-sans">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Documents Moderation */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
            Platform Uploaded Documents Overview
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {docs.map((d) => (
              <div key={d._id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{d.originalName}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Owner: {d.ownerName} ({d.ownerEmail}) · {d.pageCount} pages · {d.chunkCount} chunks
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  d.status === 'ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
