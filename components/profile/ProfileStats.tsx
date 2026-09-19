import { formatCompact, formatSolWithSymbol } from '@/lib/utils/formatSol';
import type { ProfileStats as ProfileStatsType } from '@/types';

export interface ProfileStatsProps {
  stats: ProfileStatsType;
}

/** Horizontal row of profile counters. */
export function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    { label: 'Posts', value: formatCompact(stats.posts) },
    { label: 'Followers', value: formatCompact(stats.followers) },
    { label: 'Following', value: formatCompact(stats.following) },
    { label: 'Pumped in', value: formatSolWithSymbol(stats.totalPumpedReceived) },
  ];

  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-1.5">
          <dt className="font-semibold text-neutral-900 dark:text-neutral-100">{item.value}</dt>
          <dd className="text-neutral-500">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}
