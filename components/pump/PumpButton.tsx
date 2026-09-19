'use client';

import { useState } from 'react';
import { PumpConfirmModal } from './PumpConfirmModal';
import { useWallet } from '@/hooks/useWallet';
import { formatCompact } from '@/lib/utils/formatSol';
import { cn } from '@/lib/utils/cn';
import type { Post } from '@/types';

export interface PumpButtonProps {
  post: Post;
  /** Called with the new running total after a successful pump. */
  onPumped?: (newTotal: number) => void;
  /** Compact mode for dense lists. */
  compact?: boolean;
}

/**
 * Primary interaction: shows the post's total pumped amount (like a like
 * counter) and opens the pump flow. Requires a connected wallet — visitors
 * are prompted to connect instead.
 */
export function PumpButton({ post, onPumped, compact }: PumpButtonProps) {
  const { connected, openConnectModal } = useWallet();
  const [open, setOpen] = useState(false);

  function handleClick() {
    if (!connected) {
      openConnectModal();
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={connected ? 'Pump this post' : 'Connect wallet to pump'}
        title={connected ? 'Pump this post' : 'Connect wallet to pump'}
        className={cn(
          'group inline-flex items-center gap-2 rounded-full border font-semibold transition',
          'border-accent/40 text-accent hover:bg-accent hover:text-accent-fg',
          post.pumpedByViewer && 'bg-accent/10',
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        )}
      >
        <svg
          width={compact ? 14 : 16}
          height={compact ? 14 : 16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {/* upward "pump" chevrons */}
          <polyline points="17 11 12 6 7 11" />
          <polyline points="17 18 12 13 7 18" />
        </svg>
        <span>{formatCompact(post.totalPumped)}</span>
        <span className="text-[0.7em] font-normal opacity-70">SOL</span>
      </button>

      <PumpConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        post={post}
        onPumped={onPumped}
      />
    </>
  );
}
