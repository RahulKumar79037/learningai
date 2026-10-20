import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Coffee, Binary, Database, Cpu, Network, Globe, Layers, Brain, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

const iconMap: Record<string, any> = {
  Coffee,
  Binary,
  Database,
  Cpu,
  Network,
  Globe,
  Layers,
  Brain,
  BookOpen,
};

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/curriculum/subjects')
      .then(res => {
        if (res.data?.success) {
          setSubjects(res.data.data.subjects);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Computer Science Curriculum
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore eight core undergraduate computing subjects structured with rigorous academic modules.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const Icon = iconMap[sub.icon] || BookOpen;
            return (
              <NavLink
                key={sub._id}
                to={`/curriculum/${sub.slug}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-500/80 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {sub.moduleCount} Academic Modules
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};
