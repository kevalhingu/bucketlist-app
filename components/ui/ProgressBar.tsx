'use client';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const color =
    value === 100
      ? 'from-emerald-500 to-green-400'
      : value >= 50
      ? 'from-blue-500 to-cyan-400'
      : 'from-slate-600 to-slate-500';

  return (
    <div className={`w-full h-1.5 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}
