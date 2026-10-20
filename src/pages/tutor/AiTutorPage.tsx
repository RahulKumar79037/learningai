import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  AlertCircle,
  RotateCcw,
  User,
  GraduationCap,
  Briefcase,
  Layers,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import api from '../../api/client';
import { MarkdownViewer } from '../../components/common/MarkdownViewer';

export type TutorMode = 'beginner' | 'advanced';

const MODES: Array<{
  id: TutorMode;
  name: string;
  badge: string;
  description: string;
  icon: any;
}> = [
  {
    id: 'beginner',
    name: 'Beginner',
    badge: 'Basics & College Exams',
    description: 'Detailed teaching for easy understanding: simple English, step-by-step working, diagrams & concise exam answers',
    icon: HelpCircle,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    badge: 'Deep Tech & Systems',
    description: 'In-depth technical understanding: internal architecture, complexity proofs, design trade-offs & failure scenarios',
    icon: Layers,
  },
];

export const AiTutorPage: React.FC = () => {
  const location = useLocation();
  const initialQuestion = (location.state as any)?.initialQuestion || '';

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState(initialQuestion);
  const [mode, setMode] = useState<TutorMode>('beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleModeChange = (newMode: TutorMode) => {
    setMode(newMode);
    if (activeConvId) {
      api.patch(`/tutor/conversations/${activeConvId}`, { mode: newMode }).catch(() => {});
    }
  };

  // Load conversations list
  const loadConversations = async () => {
    try {
      const res = await api.get('/tutor/conversations');
      if (res.data?.success) {
        const list = res.data.data.conversations;
        setConversations(list);
        if (list.length > 0 && !activeConvId) {
          setActiveConvId(list[0]._id);
          const rawMode = list[0].mode;
          setMode(rawMode === 'advanced' ? 'advanced' : 'beginner');
        } else if (list.length === 0) {
          // Auto create first conversation
          createNewConversation();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    setError(null);
    api.get(`/tutor/conversations/${activeConvId}`)
      .then(res => {
        if (res.data?.success) {
          setMessages(res.data.data.messages || []);
          if (res.data.data.conversation?.mode) {
            const rawMode = res.data.data.conversation.mode;
            setMode(rawMode === 'advanced' ? 'advanced' : 'beginner');
          }
        }
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load conversation.');
      });
  }, [activeConvId]);

  const createNewConversation = async () => {
    try {
      const res = await api.post('/tutor/conversations', {
        title: 'New Tutoring Session',
        mode,
      });
      if (res.data?.success) {
        const newConv = res.data.data.conversation;
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(newConv._id);
        setMessages([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create conversation.');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const userText = (overrideText !== undefined ? overrideText : input).trim();
    if (!userText || loading || !activeConvId) return;

    setInput('');
    setError(null);
    setLoading(true);

    // Optimistically add user message
    const tempUserMsg = {
      _id: 'temp_' + Date.now(),
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await api.post(`/tutor/conversations/${activeConvId}/messages`, {
        content: userText,
        mode,
      });
      if (res.data?.success) {
        setMessages(prev => [
          ...prev.filter(m => m._id !== tempUserMsg._id),
          res.data.data.userMessage,
          res.data.data.modelMessage,
        ]);
        // Refresh conversations list to update title
        loadConversations();
      }
    } catch (err: any) {
      const serverMsg = err.response?.data?.error || err.message || 'AI Tutor response temporarily unavailable. Please retry in a few moments.';
      setError(serverMsg);
      // Remove optimistic message if server failed
      setMessages(prev => prev.filter(m => m._id !== tempUserMsg._id));
      setInput(userText); // Restore input for quick retry
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/tutor/conversations/${id}`);
      const remaining = conversations.filter(c => c._id !== id);
      setConversations(remaining);
      if (activeConvId === id) {
        if (remaining.length > 0) {
          setActiveConvId(remaining[0]._id);
        } else {
          setActiveConvId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.patch(`/tutor/conversations/${id}`, { title: newTitle.trim() });
      setConversations(prev => prev.map(c => (c._id === id ? { ...c, title: newTitle.trim() } : c)));
      setEditingTitleId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Left Conversations Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/30">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">History</span>
          <button
            onClick={createNewConversation}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv._id === activeConvId;
            return (
              <div
                key={conv._id}
                onClick={() => setActiveConvId(conv._id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {editingTitleId === conv._id ? (
                  <form onSubmit={(e) => handleRename(conv._id, e)} className="flex-1 mr-1" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onBlur={() => setEditingTitleId(null)}
                      autoFocus
                      className="w-full bg-white dark:bg-slate-800 border border-indigo-400 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white"
                    />
                  </form>
                ) : (
                  <span className="truncate flex-1">{conv.title}</span>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTitleId(conv._id);
                      setNewTitle(conv.title);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Rename"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(conv._id, e)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        {/* Chat Top Bar with Mode Selector */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Academic Tutor
            </h2>
          </div>

          {/* Mode Selector Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  title={m.description}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs ring-1 ring-slate-200/50 dark:ring-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isSelected
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-200/70 dark:bg-slate-750 text-slate-500 dark:text-slate-400'
                  }`}>
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Learning Companion AI Tutor ({mode === 'beginner' ? 'Beginner Mode' : 'Advanced Mode'})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {mode === 'beginner'
                  ? 'Step-by-step teaching for easy understanding: simple English, standard definitions, labeled diagrams, and concise college exam answers.'
                  : 'In-depth technical architecture: internal mechanisms, formal Big-O proofs, state transitions, design trade-offs, and edge cases.'}
              </p>

              {/* Sample Starters */}
              <div className="grid grid-cols-1 gap-2 w-full text-left">
                {(mode === 'beginner'
                  ? [
                      'What is a stack?',
                      'Explain TCP and UDP',
                      'What is a Data Structure and why does it matter?',
                      'Explain the types of Operating Systems with examples.',
                    ]
                  : [
                      'Explain stack implementation and amortized complexity',
                      'Explain the TCP three-way handshake and connection state transitions',
                      'Analyze B-Tree vs B+ Tree internal node layout, branch factor, and disk I/O',
                      'Derive the time complexity of QuickSort vs MergeSort with proof',
                    ]
                ).map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(sample);
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all text-left flex items-center justify-between"
                  >
                    <span>"{sample}"</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider ml-2 shrink-0">
                      {mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg._id || index} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-2xl p-4.5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-xs rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <MarkdownViewer content={msg.content} />
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl rounded-tl-none p-4 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-medium">Formulating academic answer...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => handleSendMessage(undefined, input)}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask an academic question in ${mode === 'beginner' ? 'Beginner' : 'Advanced'} mode...`}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
