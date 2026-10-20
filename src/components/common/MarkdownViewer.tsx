import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, Check, Terminal, Network } from 'lucide-react';
import { normalizeAcademicMarkdown } from '../../../server/src/utils/academicMarkdown.js';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export { normalizeAcademicMarkdown };

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const processedContent = useMemo(() => normalizeAcademicMarkdown(content), [content]);

  return (
    <div className={`academic-textbook-content text-slate-800 dark:text-slate-200 leading-relaxed font-sans ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          h1({ children }) {
            return (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-7 mb-4 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3 tracking-tight flex items-center gap-2">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-2">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">
                {children}
              </h4>
            );
          },
          p({ children }) {
            return (
              <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 my-3">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-outside pl-5 my-3 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-outside pl-5 my-3 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="leading-relaxed pl-1 text-slate-700 dark:text-slate-300">
                {children}
              </li>
            );
          },
          strong({ children }) {
            return (
              <strong className="font-bold text-slate-900 dark:text-white">
                {children}
              </strong>
            );
          },
          em({ children }) {
            return (
              <em className="italic text-slate-800 dark:text-slate-200">
                {children}
              </em>
            );
          },
          hr() {
            return <hr className="my-6 border-slate-200 dark:border-slate-800" />;
          },
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1].toLowerCase() : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || codeString.includes('\n'))) {
              if (['diagram', 'ascii', 'flowchart', 'architecture', 'mermaid'].includes(lang)) {
                return <DiagramBlock language={lang || 'diagram'} value={codeString} />;
              }
              return <CodeBlock language={lang || 'code'} value={codeString} />;
            }
            return (
              <code className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded font-mono text-xs font-semibold" {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-5 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs bg-white dark:bg-slate-900">
                <table className="min-w-full divide-y divide-slate-200 dark:border-slate-800 text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 text-sm align-top">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 px-4 py-3 my-4 rounded-r-xl text-slate-700 dark:text-slate-300 not-italic shadow-xs">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-300">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-slate-800"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <pre className="m-0 bg-transparent p-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};

const DiagramBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-900 font-mono text-xs shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/60 dark:bg-slate-800/80 border-b border-indigo-200 dark:border-indigo-900/60 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Network className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-700 dark:text-indigo-300">
            Concept Diagram & Architecture
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-white/60 dark:hover:bg-slate-700"
          title="Copy diagram"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre font-mono">
        <pre className="m-0 bg-transparent p-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};
