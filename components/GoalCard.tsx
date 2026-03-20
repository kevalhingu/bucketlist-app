'use client';
import { motion } from 'framer-motion';
import { Calendar, Flag, CheckCircle2, Trash2, Pencil, Eye } from 'lucide-react';
import { Goal } from '@/lib/types';
import { CategoryBadge, StatusBadge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { PRIORITY_COLORS, STATUS_PROGRESS } from '@/lib/constants';

interface GoalCardProps {
  goal: Goal;
  onComplete: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onView: (goal: Goal) => void;
  index: number;
}

export function GoalCard({ goal, onComplete, onEdit, onDelete, onView, index }: GoalCardProps) {
  const progress = STATUS_PROGRESS[goal.status];
  const isCompleted = goal.status === 'Completed';

  const formattedDate = goal.targetDate
    ? new Date(goal.targetDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative bg-white/5 border rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/8 hover:shadow-xl hover:shadow-black/20 ${
        isCompleted ? 'border-emerald-500/30' : 'border-white/10'
      }`}
    >
      {isCompleted && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-base leading-snug truncate ${
              isCompleted ? 'text-slate-400 line-through' : 'text-white'
            }`}
          >
            {goal.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onView(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="View"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(goal.goalId)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-slate-400 text-sm line-clamp-2 mb-3">{goal.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <CategoryBadge category={goal.category} />
        <StatusBadge status={goal.status} />
      </div>

      <ProgressBar value={progress} className="mb-3" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          )}
          <span className={`flex items-center gap-1 font-medium ${PRIORITY_COLORS[goal.priority]}`}>
            <Flag size={12} />
            {goal.priority}
          </span>
        </div>

        {!isCompleted && (
          <button
            onClick={() => onComplete(goal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200"
          >
            <CheckCircle2 size={13} />
            Complete
          </button>
        )}
        {isCompleted && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle2 size={13} />
            Done
          </span>
        )}
      </div>
    </motion.div>
  );
}
