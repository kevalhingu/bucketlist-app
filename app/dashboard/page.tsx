'use client';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { Goal, GoalFormData, Category, Status } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { StatsBar } from '@/components/StatsBar';
import { GoalCard } from '@/components/GoalCard';
import { GoalForm } from '@/components/GoalForm';
import { GoalDetail } from '@/components/GoalDetail';
import { Celebration } from '@/components/Celebration';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { CATEGORIES } from '@/lib/constants';

type FilterCategory = Category | 'All';
type FilterStatus = Status | 'All';

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [viewGoal, setViewGoal] = useState<Goal | null>(null);

  const [celebration, setCelebration] = useState({ show: false, title: '' });
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('All');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch('/api/goals');
      if (!res.ok) throw new Error('Failed to load goals');
      const data = await res.json();
      setGoals(data);
      setError(null);
    } catch (e) {
      setError('Could not connect to the database. Check your AWS configuration.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreate = async (data: GoalFormData) => {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create goal');
    const goal = await res.json();
    setGoals((prev) => [goal, ...prev]);
    setShowCreate(false);
  };

  const handleUpdate = async (data: GoalFormData) => {
    if (!editGoal) return;
    const res = await fetch(`/api/goals/${editGoal.goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update goal');
    const updated = await res.json();
    setGoals((prev) => prev.map((g) => (g.goalId === updated.goalId ? updated : g)));
    setEditGoal(null);
  };

  const handleComplete = async (goal: Goal) => {
    const res = await fetch(`/api/goals/${goal.goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Completed' }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setGoals((prev) => prev.map((g) => (g.goalId === updated.goalId ? updated : g)));
    setCelebration({ show: true, title: goal.title });
    setTimeout(() => setCelebration({ show: false, title: '' }), 2500);
  };

  const handleDelete = async (goalId: string) => {
    await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
    setGoals((prev) => prev.filter((g) => g.goalId !== goalId));
  };

  const filtered = goals.filter((g) => {
    const catOk = filterCategory === 'All' || g.category === filterCategory;
    const statusOk = filterStatus === 'All' || g.status === filterStatus;
    return catOk && statusOk;
  });

  const statusOptions: FilterStatus[] = ['All', 'Planned', 'In Progress', 'Completed'];
  const categoryOptions: FilterCategory[] = ['All', ...CATEGORIES];

  const selectClass =
    'bg-white/5 border border-white/10 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500/60 transition-colors';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <Navbar showAdd onAdd={() => setShowCreate(true)} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">My Goals</h1>
          <p className="text-slate-400">Track and achieve your life bucket list.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm">
            {error}
          </div>
        )}

        <StatsBar goals={goals} />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Filter size={16} className="text-slate-500" />
          <select
            className={selectClass}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c} className="bg-slate-800">
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s} className="bg-slate-800">
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
          {(filterCategory !== 'All' || filterStatus !== 'All') && (
            <button
              onClick={() => { setFilterCategory('All'); setFilterStatus('All'); }}
              className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Goals grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filtered.length === 0 && goals.length === 0 ? (
          <EmptyState onAdd={() => setShowCreate(true)} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No goals match the current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((goal, i) => (
                <GoalCard
                  key={goal.goalId}
                  goal={goal}
                  index={i}
                  onComplete={handleComplete}
                  onEdit={setEditGoal}
                  onDelete={handleDelete}
                  onView={setViewGoal}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* FAB for mobile */}
        <button
          onClick={() => setShowCreate(true)}
          className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-gradient-to-br from-violet-600 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-violet-500/30 z-30"
        >
          <Plus size={24} className="text-white" />
        </button>
      </main>

      {/* Modals */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Goal">
        <GoalForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal open={!!editGoal} onClose={() => setEditGoal(null)} title="Edit Goal">
        {editGoal && (
          <GoalForm
            initial={editGoal}
            onSubmit={handleUpdate}
            onCancel={() => setEditGoal(null)}
          />
        )}
      </Modal>

      <GoalDetail
        goal={viewGoal}
        onClose={() => setViewGoal(null)}
        onEdit={(g) => { setViewGoal(null); setEditGoal(g); }}
      />

      <Celebration show={celebration.show} goalTitle={celebration.title} />
    </div>
  );
}
