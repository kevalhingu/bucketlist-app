'use client';
import { motion } from 'framer-motion';
import { Target, Plus } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onAdd?: () => void;
  showAdd?: boolean;
}

export function Navbar({ onAdd, showAdd = false }: NavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <Target size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">BucketList</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Dashboard
          </Link>
          {showAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Goal</span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
