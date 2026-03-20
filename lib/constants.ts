import { Category, Priority, Status } from './types';

export const CATEGORIES: Category[] = ['Travel', 'Skill', 'Adventure', 'Career', 'Personal'];
export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
export const STATUSES: Status[] = ['Planned', 'In Progress', 'Completed'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Travel: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Skill: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Adventure: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Career: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Personal: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

export const CATEGORY_DOT: Record<Category, string> = {
  Travel: 'bg-sky-400',
  Skill: 'bg-violet-400',
  Adventure: 'bg-orange-400',
  Career: 'bg-emerald-400',
  Personal: 'bg-pink-400',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: 'text-slate-400',
  Medium: 'text-amber-400',
  High: 'text-rose-400',
};

export const STATUS_COLORS: Record<Status, string> = {
  Planned: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Completed: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export const STATUS_PROGRESS: Record<Status, number> = {
  Planned: 0,
  'In Progress': 50,
  Completed: 100,
};
