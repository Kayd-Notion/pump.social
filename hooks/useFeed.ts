'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FeedTab, Post } from '@/types';
import { fetchFeed } from '@/lib/indexer/api';

interface UseFeedResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  /** Optimistically bump a post's total after a successful pump. */
  applyPump: (postId: string, newTotal: number) => void;
}

/** Loads and manages the feed for a given tab. */
export function useFeed(tab: FeedTab = 'for-you'): UseFeedResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFeed(tab)
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load the feed.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => load(), [load]);

  const applyPump = useCallback((postId: string, newTotal: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, totalPumped: newTotal, pumpCount: p.pumpCount + 1, pumpedByViewer: true }
          : p,
      ),
    );
  }, []);

  return { posts, loading, error, refresh: load, applyPump };
}
