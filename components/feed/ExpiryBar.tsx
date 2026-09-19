'use client';

import { usePostExpiry } from '@/hooks/usePostExpiry';
import { cn } from '@/lib/utils/cn';

export interface ExpiryBarProps {
  createdAt: string;
  expiresAt: string;
  /** Hide the textual label and show only the gauge. */
  hideLabel?: boolean;
  className?: string;
}

/**
 * Live time-remaining gauge for a post. The bar shrinks as expiry approaches
 * and turns amber/red in the final stretch to signal urgency.
 */
export function ExpiryBar({ createdAt, expiresAt, hideLabel, className }: ExpiryBarProps) {
  const { fraction, label, expired } = usePostExpiry(createdAt, expiresAt);

  const tone = expired
    ? 'bg-neutral-400'
    : fraction < 0.15
      ? 'bg-red-500'
      : fraction < 0.4
        ? 'bg-amber-500'
        : 'bg-accent';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
        role="progressbar"
        aria-valuenow={Math.round(fraction * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Time remaining before expiry"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', tone)}
          style={{ width: `${Math.max(2, fraction * 100)}%` }}
        />
      </div>
      {!hideLabel && (
        <span
          className={cn(
            'shrink-0 text-xs tabular-nums',
            expired ? 'text-neutral-400' : 'text-neutral-500',
          )}
        >
          {expired ? 'Expired' : `${label} left`}
        </span>
      )}
    </div>
  );
}
