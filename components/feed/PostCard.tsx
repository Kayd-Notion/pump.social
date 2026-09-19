'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { PumpButton } from '@/components/pump/PumpButton';
import { ReportButton } from '@/components/moderation/ReportButton';
import { ExpiryBar } from './ExpiryBar';
import { formatCompact } from '@/lib/utils/formatSol';
import { formatRelativeTime } from '@/lib/utils/timeRemaining';
import type { Post } from '@/types';

export interface PostCardProps {
  post: Post;
  /** Notified with the new total when the post is pumped, for optimistic UI. */
  onPumped?: (postId: string, newTotal: number) => void;
}

/**
 * The core feed unit: author, text, optional media, live expiry gauge, the
 * pump counter/button, and lightweight engagement actions. Deliberately
 * style-light so it can be re-skinned without touching structure.
 */
export function PostCard({ post, onPumped }: PostCardProps) {
  const [total, setTotal] = useState(post.totalPumped);

  function handlePumped(newTotal: number) {
    setTotal(newTotal);
    onPumped?.(post.id, newTotal);
  }

  // Keep the child button in sync while exposing the optimistic total locally.
  const displayedPost: Post = { ...post, totalPumped: total };

  return (
    <article className="border-b border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex gap-3">
        <Link href={`/profile/${post.author.username}`} className="shrink-0">
          <Avatar src={post.author.avatarUrl} fallback={post.author.username} />
        </Link>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center gap-1.5 text-sm">
            <Link
              href={`/profile/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.displayName ?? post.author.username}
            </Link>
            <span className="truncate text-neutral-500">@{post.author.username}</span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-500">{formatRelativeTime(post.createdAt)}</span>
            <div className="ml-auto">
              <ReportButton postId={post.id} />
            </div>
          </div>

          {/* Body */}
          <Link href={`/post/${post.id}`} className="mt-1 block">
            {post.text && (
              <p className="whitespace-pre-wrap text-[15px] leading-normal text-neutral-900 dark:text-neutral-100">
                {post.text}
              </p>
            )}
            {post.media && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                {post.media.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.media.url}
                    alt={post.media.alt ?? ''}
                    className="max-h-[512px] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={post.media.url}
                    poster={post.media.posterUrl}
                    controls
                    playsInline
                    className="max-h-[512px] w-full bg-black object-contain"
                  />
                )}
              </div>
            )}
          </Link>

          {/* Expiry gauge */}
          <div className="mt-3">
            <ExpiryBar createdAt={post.createdAt} expiresAt={post.expiresAt} />
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-4 text-sm text-neutral-500">
            <PumpButton post={displayedPost} onPumped={handlePumped} />

            <Link
              href={`/post/${post.id}`}
              className="inline-flex items-center gap-1.5 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {formatCompact(post.commentCount)}
            </Link>

            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              {formatCompact(post.pumpCount)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
