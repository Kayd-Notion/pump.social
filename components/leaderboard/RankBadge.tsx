import { cn } from '@/lib/utils/cn';

export interface RankBadgeProps {
  rank: number;
  className?: string;
}

/** Circular rank indicator; medals for the top 3. */
export function RankBadge({ rank, className }: RankBadgeProps) {
  const medal =
    rank === 1
      ? 'bg-amber-400 text-black'
      : rank === 2
        ? 'bg-neutral-300 text-black'
        : rank === 3
          ? 'bg-orange-400 text-black'
          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';

  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold tabular-nums',
        medal,
        className,
      )}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </span>
  );
}
