'use client';
import { useState } from 'react';
import { Goal, GoalFormData } from '@/lib/types';
import { CATEGORIES, PRIORITIES, STATUSES } from '@/lib/constants';

interface GoalFormProps {
  initial?: Goal;
  onSubmit: (data: GoalFormData) => Promise<void>;
  onCancel: () => void;
}

const defaultForm: GoalFormData = {
  title: '',
  description: '',
  category: 'Personal',
  priority: 'Medium',
  targetDate: '',
  status: 'Planned',
};

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const [form, setForm] = useState<GoalFormData>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          category: initial.category,
          priority: initial.priority,
          targetDate: initial.targetDate,
          status: initial.status,
        }
      : defaultForm
  );
  const [loading, setLoading] = useState(false);

  const set = (key: keyof GoalFormData, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-colors text-sm';
  const labelClass = 'block text-sm font-medium text-slate-300 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input
          className={inputClass}
          placeholder="e.g. Visit the Northern Lights"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Describe your goal..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-800">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select
            className={inputClass}
            value={form.priority}
            onChange={(e) => set('priority', e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p} className="bg-slate-800">
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Target Date</label>
          <input
            type="date"
            className={inputClass}
            value={form.targetDate}
            onChange={(e) => set('targetDate', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-slate-800">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium text-sm transition-all duration-200 disabled:opacity-50 shadow-lg shadow-violet-500/20"
        >
          {loading ? 'Saving...' : initial ? 'Update Goal' : 'Create Goal'}
        </button>
      </div>
    </form>
  );
}
