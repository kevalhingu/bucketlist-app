'use client';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-6">
        <Target size={36} className="text-violet-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No goals yet</h3>
      <p className="text-slate-400 mb-8 max-w-sm">
        Start building your bucket list. Add your first life goal and begin your journey.
      </p>
      <button
        onClick={onAdd}
        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25"
      >
        Add your first goal
      </button>
    </motion.div>
  );
}
