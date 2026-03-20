'use client';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Goal } from '@/lib/types';

interface StatsBarProps {
  goals: Goal[];
}

export function StatsBar({ goals }: StatsBarProps) {
  const total = goals.length;
  const completed = goals.filter((g) => g.status === 'Completed').length;
  const inProgress = goals.filter((g) => g.status === 'In Progress').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Goals',
      value: total,
      icon: Target,
      color: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-400',
      border: 'border-violet-500/20',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    {
      label: 'Progress',
      value: `${progress}%`,
      icon: TrendingUp,
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-400',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-5 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{stat.label}</span>
            <stat.icon size={18} className={stat.iconColor} />
          </div>
          <div className="text-3xl font-bold text-white">{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
