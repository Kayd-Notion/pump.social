'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { PumpButton } from '@/components/pump/PumpButton';
import { PumpHistoryList } from '@/components/pump/PumpHistoryList';
import { ExpiryBar } from '@/components/feed/ExpiryBar';
import { ReportButton } from '@/components/moderation/ReportButton';
import { fetchPost } from '@/lib/indexer/api';
import { formatCompact } from '@/lib/utils/formatSol';
import { formatRelativeTime } from '@/lib/utils/timeRemaining';
import type { Post } from '@/types';

/** Client-side post detail: full post, live expiry, pump action and history. */
export function PostDetail({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchPost(postId).then((data) => {
      if (!cancelled) setPost(data);
    });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (post === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="p-8 text-center text-sm text-neutral-500">
        This post doesn&apos;t exist or has expired.{' '}
        <Link href="/" className="text-accent underline">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <article className="p-4">
      <div className="flex items-center gap-3">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar src={post.author.avatarUrl} fallback={post.author.username} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline">
            {post.author.displayName ?? post.author.username}
          </Link>
          <p className="text-sm text-neutral-500">@{post.author.username}</p>
        </div>
        <ReportButton postId={post.id} />
      </div>

      <p className="mt-4 whitespace-pre-wrap text-lg leading-normal">{post.text}</p>

      {post.media && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          {post.media.type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.media.url} alt={post.media.alt ?? ''} className="w-full object-cover" />
          ) : (
            <video
              src={post.media.url}
              poster={post.media.posterUrl}
              controls
              playsInline
              className="w-full bg-black"
            />
          )}
        </div>
      )}

      <p className="mt-4 text-sm text-neutral-500">
        {formatRelativeTime(post.createdAt)} ago · {formatCompact(post.commentCount)} comments
      </p>

      <div className="mt-4">
        <ExpiryBar createdAt={post.createdAt} expiresAt={post.expiresAt} />
      </div>

      <div className="mt-4 flex items-center gap-4 border-y border-neutral-200 py-3 dark:border-neutral-800">
        <PumpButton post={post} onPumped={(t) => setPost({ ...post, totalPumped: t })} />
        <span className="text-sm text-neutral-500">
          {formatCompact(post.pumpCount)} pumps
        </span>
      </div>

      <section className="mt-4">
        <h2 className="mb-1 text-sm font-semibold">Recent pumps</h2>
        <PumpHistoryList postId={post.id} />
      </section>
    </article>
  );
}
