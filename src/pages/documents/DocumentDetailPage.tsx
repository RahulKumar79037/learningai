import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Bot,
  Sparkles,
  Layers,
  Send,
  Loader2,
  Copy,
  Check,
  Download,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import api from '../../api/client';
import { MarkdownViewer } from '../../components/common/MarkdownViewer';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'summaries' | 'chunks'>('chat');
  const [loading, setLoading] = useState(true);
  const [docError, setDocError] = useState<string | null>(null);

  // Chat tab state
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string; citations: any[] }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Summaries tab state
  const [summaries, setSummaries] = useState<any[]>([]);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryType, setSummaryType] = useState<'detailed' | 'quick'>('detailed');
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Chunks tab state
  const [chunks, setChunks] = useState<any[]>([]);
  const [chunksLoading, setChunksLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setDocError(null);
    api.get(`/documents/${id}`)
      .then(res => {
        if (res.data?.success) {
          const docData = res.data.data.document;
          setDoc(docData);
          if (docData && docData.status !== 'failed') {
            api.get(`/documents/${id}/summaries`)
              .then(sumRes => {
                if (sumRes.data?.success) setSummaries(sumRes.data.data.summaries || []);
              })
              .catch(() => {});
          }
        }
      })
      .catch(err => {
        setDocError(err.response?.data?.error || 'Document not found or inaccessible.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Load chunks when tab clicked
  useEffect(() => {
    if (activeTab === 'chunks' && chunks.length === 0 && id) {
      setChunksLoading(true);
      api.get(`/documents/${id}/chunks`)
        .then(res => {
          if (res.data?.success) setChunks(res.data.data.chunks || []);
        })
        .catch(err => console.error(err))
        .finally(() => setChunksLoading(false));
    }
  }, [activeTab, id, chunks.length]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || chatLoading || !id) return;

    const qText = question.trim();
    setQuestion('');
    setChatLoading(true);
    setChatError(null);

    try {
      const res = await api.post(`/documents/${id}/ask`, { question: qText });
      if (res.data?.success) {
        setChatHistory(prev => [
          ...prev,
          {
            q: qText,
            a: res.data.data.answer,
            citations: res.data.data.citations || [],
          },
        ]);
      }
    } catch (err: any) {
      setChatError(err.response?.data?.error || err.message || 'RAG response generation failed.');
      setQuestion(qText);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!id || generatingSummary) return;
    setGeneratingSummary(true);
    setSummaryError(null);

    try {
      const res = await api.post(`/documents/${id}/summarize`, { summaryType });
      if (res.data?.success) {
        setSummaries(prev => [res.data.data.summary, ...prev]);
      }
    } catch (err: any) {
      setSummaryError(err.response?.data?.error || err.message || 'Summary synthesis failed.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto py-12"><CardSkeleton /></div>;
  if (!doc) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Document Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {docError || 'This document may have been deleted or is not accessible.'}
        </p>
        <NavLink
          to="/documents"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Documents
        </NavLink>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <NavLink
            to="/documents"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Documents
          </NavLink>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            {doc.originalName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {doc.pageCount} pages · {doc.chunkCount} indexed passages · {Math.round(doc.sizeBytes / 1024)} KB
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> Grounded Q&A
          </button>
          <button
            onClick={() => setActiveTab('summaries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'summaries'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Summaries
          </button>
          <button
            onClick={() => setActiveTab('chunks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'chunks'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Source Chunks ({doc.chunkCount})
          </button>
        </div>
      </div>

      {/* Extraction Failure Alert Banner */}
      {doc.status === 'failed' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-semibold mb-0.5">Text Extraction Incomplete or Unsupported</p>
            <p className="leading-relaxed opacity-90">
              {doc.error || 'The uploaded file appears to be a scanned image or contains encrypted character streams that could not be parsed.'}
              {' '}Please upload a searchable digital PDF, DOCX, or text file to enable grounded Q&A and academic summaries.
            </p>
          </div>
        </div>
      )}

      {/* Tab 1: Grounded RAG Q&A */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col min-h-[500px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Grounded in {doc.originalName}
            </span>
            <span className="text-[11px] text-slate-400">Strict Page Citation Enabled</span>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {chatHistory.length === 0 && !chatLoading && (
              <div className="text-center py-12 max-w-md mx-auto text-slate-500 dark:text-slate-400">
                <Bot className="w-10 h-10 text-indigo-600 mx-auto mb-2 opacity-80" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Ask Any Question Grounded in this Document
                </h3>
                <p className="text-xs leading-relaxed mb-4">
                  The AI retrieves the most relevant textbook passages and constructs a verified academic answer with exact page citations.
                </p>
                <div className="space-y-1.5 text-xs text-left">
                  <button
                    onClick={() => setQuestion('What are the key concepts and formal definitions in this document?')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left bg-slate-50 dark:bg-slate-800/40"
                  >
                    "What are the key concepts and formal definitions in this document?"
                  </button>
                  <button
                    onClick={() => setQuestion('Explain the main algorithms and complexity bounds described.')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left bg-slate-50 dark:bg-slate-800/40"
                  >
                    "Explain the main algorithms and complexity bounds described."
                  </button>
                </div>
              </div>
            )}

            {chatHistory.map((item, i) => (
              <div key={i} className="space-y-3">
                {/* Student Question */}
                <div className="flex justify-end">
                  <div className="max-w-xl bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-xs sm:text-sm font-medium">
                    {item.q}
                  </div>
                </div>

                {/* Grounded AI Answer */}
                <div className="flex justify-start">
                  <div className="max-w-2xl bg-slate-50 dark:bg-slate-800/50 rounded-2xl rounded-tl-none p-5 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm space-y-4">
                    <MarkdownViewer content={item.a} />

                    {/* Citations Box */}
                    {item.citations && item.citations.length > 0 && (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                          Verified Source Passages & Citations:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.citations.map((c: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                                [Page {c.pageNumber}]
                              </span>
                              <p className="text-slate-600 dark:text-slate-300 italic line-clamp-2">
                                "{c.snippet}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>Retrieving relevant passages and synthesizing answer...</span>
              </div>
            )}

            {chatError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{chatError}</span>
              </div>
            )}
          </div>

          {/* Question Input Form */}
          <form onSubmit={handleAskQuestion} className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={doc.status === 'failed'}
              placeholder={doc.status === 'failed' ? 'Text extraction incomplete. Upload a readable document to ask questions.' : `Ask a question grounded in ${doc.originalName}...`}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={chatLoading || !question.trim() || doc.status === 'failed'}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Summaries */}
      {activeTab === 'summaries' && (
        <div className="space-y-6">
          {/* Summary Generator Action Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Generate Academic Summary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select summary depth. The robust multi-pass pipeline extracts sections, removes fluff, and synthesizes grounded text.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <select
                value={summaryType}
                onChange={(e: any) => setSummaryType(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="detailed">Detailed Academic Summary (50–100 rendered pages target)</option>
                <option value="quick">Quick Revision Summary (10–20 rendered pages target)</option>
              </select>

              <button
                onClick={handleGenerateSummary}
                disabled={generatingSummary || doc.status === 'failed'}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {generatingSummary ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {summaryError && (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{summaryError}</span>
            </div>
          )}

          {/* Summaries List */}
          {summaries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No summaries generated yet. Click "Generate" above to create a detailed or quick summary.
            </div>
          ) : (
            <div className="space-y-6">
              {summaries.map((s) => (
                <div
                  key={s._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mr-2">
                        {s.summaryType === 'detailed' ? 'Detailed Academic Summary' : 'Quick Revision Summary'}
                      </span>
                      <span className="text-xs text-slate-400">· ~{s.estimatedPages} Rendered A4 Pages</span>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Markdown Content */}
                  <div className="py-2">
                    <MarkdownViewer content={s.content} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Chunks Explorer */}
      {activeTab === 'chunks' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Extracted Text Chunks ({doc.chunkCount} indexed segments)
          </h3>

          {chunksLoading ? (
            <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" /></div>
          ) : (
            <div className="space-y-3">
              {chunks.map((ch) => (
                <div
                  key={ch._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2 font-mono text-[11px]">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Chunk #{ch.chunkIndex + 1}</span>
                    <span>Estimated Page {ch.pageNumber}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                    {ch.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
