'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { fetchPumps } from '@/lib/indexer/api';
import { formatSolWithSymbol } from '@/lib/utils/formatSol';
import { formatRelativeTime } from '@/lib/utils/timeRemaining';
import type { Pump } from '@/types';

export interface PumpHistoryListProps {
  postId: string;
}

/** Recent pumps for a post (used on the post detail page). */
export function PumpHistoryList({ postId }: PumpHistoryListProps) {
  const [pumps, setPumps] = useState<Pump[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPumps(postId).then((data) => {
      if (!cancelled) setPumps(data);
    });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (pumps === null) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (pumps.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-500">No pumps yet. Be the first!</p>;
  }

  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {pumps.map((pump) => (
        <li key={pump.id} className="flex items-center gap-3 py-3">
          <Link href={`/profile/${pump.from.username}`}>
            <Avatar src={pump.from.avatarUrl} fallback={pump.from.username} size="sm" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/profile/${pump.from.username}`}
              className="truncate text-sm font-medium hover:underline"
            >
              @{pump.from.username}
            </Link>
            <p className="text-xs text-neutral-500">{formatRelativeTime(pump.createdAt)} ago</p>
          </div>
          <span className="text-sm font-semibold text-accent">
            +{formatSolWithSymbol(pump.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
