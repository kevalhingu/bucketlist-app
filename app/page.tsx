'use client';
import { motion } from 'framer-motion';
import { Target, ArrowRight, CheckCircle2, Sparkles, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Target,
    title: 'Set Life Goals',
    desc: 'Define goals across travel, skills, career, and personal growth.',
    color: 'text-violet-400',
    bg: 'from-violet-500/10 to-violet-600/5',
    border: 'border-violet-500/20',
  },
  {
    icon: CheckCircle2,
    title: 'Track Progress',
    desc: 'Watch your progress with animated indicators and status updates.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
  },
  {
    icon: Globe,
    title: 'Organize by Category',
    desc: 'Sort goals by Travel, Skill, Adventure, Career, or Personal.',
    color: 'text-sky-400',
    bg: 'from-sky-500/10 to-sky-600/5',
    border: 'border-sky-500/20',
  },
  {
    icon: Zap,
    title: 'Stay Motivated',
    desc: 'Celebrate completions with visual effects and keep momentum going.',
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20',
  },
];

const categories = ['Travel', 'Skill', 'Adventure', 'Career', 'Personal'];
const categoryColors = [
  'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Target size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">BucketList</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25"
          >
            Open App
            <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
            <Sparkles size={14} />
            Life Goals Tracker
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Your dreams,</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              organized.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            BucketList helps you capture, track, and achieve the experiences and goals that matter most in life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-xl shadow-violet-500/30 text-base"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Category pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {categories.map((cat, i) => (
            <span
              key={cat}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[i]}`}
            >
              {cat}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className={`bg-gradient-to-br ${f.bg} border ${f.border} rounded-2xl p-6 backdrop-blur-sm`}
            >
              <f.icon size={24} className={`${f.color} mb-4`} />
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-white/10 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Add your first goal today and take the first step toward the life you want.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-xl shadow-violet-500/30"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
