'use client';
import { CATEGORY_COLORS, STATUS_COLORS } from '@/lib/constants';
import { Category, Status } from '@/lib/types';

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[category]}`}
    >
      {category}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}
