import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FileUp,
  FileText,
  File,
  Trash2,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  Layers,
} from 'lucide-react';
import api from '../../api/client';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchDocuments = () => {
    setLoading(true);
    api.get('/documents')
      .then(res => {
        if (res.data?.success) setDocuments(res.data.data.documents || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (file.size === 0) {
      setUploadError('The selected file is empty (0 bytes). Please upload a valid document with content.');
      return;
    }
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        const uploadedDoc = res.data.data?.document;
        fetchDocuments();
        if (uploadedDoc?.status === 'failed') {
          setUploadError(uploadedDoc.error || 'Text extraction failed for this document.');
        } else if (uploadedDoc?._id) {
          navigate(`/documents/${uploadedDoc._id}`);
        }
      }
    } catch (err: any) {
      setUploadError(err.response?.data?.error || err.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document and all extracted chunks?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Document Workspace & RAG
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload textbooks, research papers, and lecture notes (PDF, DOCX, TXT, MD) for grounded question-answering with page citations and comprehensive summaries.
        </p>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-indigo-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
          {uploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <UploadCloud className="w-7 h-7" />}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          {uploading ? 'Processing & Indexing Document Chunks...' : 'Upload Academic Document'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-3">
          Drag and drop your file here, or click to browse. Supports PDF, DOCX, TXT, and Markdown (up to 15MB).
        </p>
        <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
          Text Extraction · Semantic Chunking · Grounded RAG with Citations
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" /> Your Uploaded Documents
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileUp}
            title="No Documents Uploaded Yet"
            description="Upload your computer science textbook or lecture notes to ask questions and generate summaries."
            actionText="Browse Files"
            onAction={() => fileInputRef.current?.click()}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                onClick={() => navigate(`/documents/${doc._id}`)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${
                      doc.status === 'ready'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : doc.status === 'failed'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    }`}>
                      {doc.status === 'ready' ? 'Indexed ✓' : doc.status}
                    </span>
                    <button
                      onClick={(e) => handleDelete(doc._id, e)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 line-clamp-1">
                    {doc.originalName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>{doc.pageCount} pages</span>
                    <span>·</span>
                    <span>{doc.chunkCount} chunks</span>
                    <span>·</span>
                    <span>{Math.round(doc.sizeBytes / 1024)} KB</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Open Workspace <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
