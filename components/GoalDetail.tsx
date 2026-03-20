'use client';
import { motion } from 'framer-motion';
import { Calendar, Flag, Clock } from 'lucide-react';
import { Goal } from '@/lib/types';
import { Modal } from './ui/Modal';
import { CategoryBadge, StatusBadge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { PRIORITY_COLORS, STATUS_PROGRESS } from '@/lib/constants';

interface GoalDetailProps {
  goal: Goal | null;
  onClose: () => void;
  onEdit: (goal: Goal) => void;
}

export function GoalDetail({ goal, onClose, onEdit }: GoalDetailProps) {
  if (!goal) return null;

  const progress = STATUS_PROGRESS[goal.status];
  const formattedTarget = goal.targetDate
    ? new Date(goal.targetDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No target date';

  const formattedCreated = new Date(goal.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal open={!!goal} onClose={onClose} title="Goal Details">
      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={goal.category} />
            <StatusBadge status={goal.status} />
          </div>
        </div>

        {goal.description && (
          <p className="text-slate-300 text-sm leading-relaxed">{goal.description}</p>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <Calendar size={16} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Target Date</div>
              <div className="text-sm text-white">{formattedTarget}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <Flag size={16} className={`shrink-0 ${PRIORITY_COLORS[goal.priority]}`} />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Priority</div>
              <div className={`text-sm font-medium ${PRIORITY_COLORS[goal.priority]}`}>
                {goal.priority}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <Clock size={16} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Created</div>
              <div className="text-sm text-white">{formattedCreated}</div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { onClose(); onEdit(goal); }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium text-sm transition-all duration-200"
        >
          Edit Goal
        </motion.button>
      </div>
    </Modal>
  );
}
