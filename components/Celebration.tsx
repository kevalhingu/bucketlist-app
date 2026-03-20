'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface CelebrationProps {
  show: boolean;
  goalTitle: string;
}

export function Celebration({ show, goalTitle }: CelebrationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti dots */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
                y: [0, -100 - Math.random() * 100],
                x: [(Math.random() - 0.5) * 200],
              }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
            />
          ))}

          <motion.div
            className="bg-slate-900/95 border border-emerald-500/30 rounded-2xl px-8 py-6 text-center shadow-2xl backdrop-blur-xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-3"
            >
              <CheckCircle2 size={48} className="text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-1">Goal Completed!</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              &ldquo;{goalTitle}&rdquo; is done. Keep going!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
