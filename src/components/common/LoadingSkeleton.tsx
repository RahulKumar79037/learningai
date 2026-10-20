import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mb-4" />
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mb-3" />
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
  </div>
);

export const ListSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="space-y-2 w-2/3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-3/4" />
        </div>
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    ))}
  </div>
);
