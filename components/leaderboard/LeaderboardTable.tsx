'use client';

import Link from 'next/link';
import { RankBadge } from './RankBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { formatSolWithSymbol } from '@/lib/utils/formatSol';

export interface LeaderboardTableProps {
  /** Country code to scope the board; omit for worldwide. */
  countryCode?: string;
}

/**
 * Ranked table of top posts by all-time cumulative pump total. A post only
 * leaves the board when another overtakes it.
 */
export function LeaderboardTable({ countryCode }: LeaderboardTableProps) {
  const { entries, loading, error } = useLeaderboard(countryCode);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="p-8 text-center text-sm text-red-500">{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-neutral-500">
        No ranked posts in this region yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {entries.map(({ rank, post }) => (
        <li key={post.id}>
          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-3 p-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <RankBadge rank={rank} />
            <Avatar src={post.author.avatarUrl} fallback={post.author.username} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">@{post.author.username}</p>
              <p className="truncate text-sm text-neutral-500">{post.text}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-accent">
              {formatSolWithSymbol(post.totalPumped)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
