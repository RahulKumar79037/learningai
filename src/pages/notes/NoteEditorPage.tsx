import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Download,
  Copy,
  Check,
  Eye,
  Edit3,
  Calendar,
  Sparkles,
  Tag,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import api from '../../api/client';
import { MarkdownViewer } from '../../components/common/MarkdownViewer';

export const NoteEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isNew) {
      setTitle('Untitled Study Note');
      setContent(
`# Topic Title

## 1. Academic Definition
> **Definition:** State the precise, standard textbook definition here.

## 2. Introduction & Detailed Explanation
Explain the concept in simple, accessible language with intuitive examples and why it is needed.

## 3. Important Characteristics
- Core Property 1
- Core Property 2

## 4. Types or Classification
Explain each type or variation separately with characteristics and examples.

## 5. Working or Step-by-Step Process
1. Step One
2. Step Two
3. Step Three

## 6. Examples (Real-World & Technical)
Practical scenarios and implementation code.

## 7. Concept Diagram & Flowchart
\`\`\`diagram
[ Input ] ---> [ Processing Step ] ---> [ Output ]
\`\`\`

## 8. Tables Comparing Related Concepts
| Criteria | Concept A | Concept B |
| :--- | :--- | :--- |
| Definition | Primary definition | Alternative definition |
| Overhead | Low | Moderate |

## 9. Advantages & Disadvantages
- **Advantages:** High efficiency, clear modularity.
- **Disadvantages:** Implementation complexity.

## 10. Summary & Exam Questions
Concise model answer suitable for college examinations.`
      );
      return;
    }

    setLoading(true);
    api.get(`/notes/${id}`)
      .then(res => {
        if (res.data?.success) {
          const n = res.data.data.note;
          setTitle(n.title);
          setContent(n.content);
          setTags(n.tags || []);
        }
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to load note.'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your study note.');
      return;
    }
    if (!content.trim()) {
      setError('Study note content cannot be empty.');
      return;
    }
    setSaving(true);
    setError(null);

    try {
      if (isNew) {
        const res = await api.post('/notes', { title, content, tags });
        if (res.data?.success) {
          navigate(`/notes/${res.data.data.note._id}`, { replace: true });
        }
      } else {
        await api.put(`/notes/${id}`, { title, content, tags });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(x => x !== t));
  };

  if (loading) return <div className="text-center py-12">Loading study note...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <NavLink
          to="/notes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Study Notes
        </NavLink>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreview ? 'Edit Markdown' : 'Preview Live'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
            title="Copy Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" /> Export .md
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Note'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Title Input */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          className="w-full text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white bg-transparent border-none focus:outline-none placeholder-slate-400"
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              #{t}
              <button onClick={() => removeTag(t)} className="text-slate-400 hover:text-slate-600">×</button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Add tag and press Enter..."
            className="text-xs text-slate-700 dark:text-slate-300 bg-transparent border-none focus:outline-none placeholder-slate-400 py-1"
          />
        </div>
      </div>

      {/* Editor or Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs min-h-[500px]">
        {isPreview ? (
          <MarkdownViewer content={content} />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write in Markdown syntax..."
            rows={22}
            className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed border-none focus:outline-none resize-y placeholder-slate-400"
          />
        )}
      </div>
    </div>
  );
};
