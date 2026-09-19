'use client';

import { PostCard } from './PostCard';
import { PostComposer } from './PostComposer';
import { Spinner } from '@/components/ui/Spinner';
import { useFeed } from '@/hooks/useFeed';
import type { FeedTab } from '@/types';

export interface FeedProps {
  tab: FeedTab;
  /** Whether to show the composer at the top (hidden on some tabs). */
  showComposer?: boolean;
}

/**
 * Reusable feed list: loads posts for a tab, shows the composer, and wires
 * optimistic pump updates. Shared by the For You / Following / Live pages.
 */
export function Feed({ tab, showComposer = true }: FeedProps) {
  const { posts, loading, error, refresh, applyPump } = useFeed(tab);

  return (
    <div>
      {showComposer && <PostComposer onPosted={refresh} />}

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="p-8 text-center text-sm text-red-500">
          {error}{' '}
          <button onClick={refresh} className="underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="p-8 text-center text-sm text-neutral-500">
          Nothing here yet.
        </p>
      )}

      {!loading &&
        !error &&
        posts.map((post) => (
          <PostCard key={post.id} post={post} onPumped={applyPump} />
        ))}
    </div>
  );
}
