'use client';

import { useEffect, useState } from 'react';
import {
  formatTimeRemaining,
  getRemainingFraction,
  getTimeRemaining,
  type TimeRemaining,
} from '@/lib/utils/timeRemaining';

interface UsePostExpiryResult {
  remaining: TimeRemaining;
  /** Fraction (0..1) of the lifetime still left; drives the gauge width. */
  fraction: number;
  /** Pre-formatted label, e.g. `23h 12m`. */
  label: string;
  expired: boolean;
}

/**
 * Live countdown for a post's expiry. Ticks every second while mounted so
 * the gauge and label stay current without a page refresh.
 */
export function usePostExpiry(createdAt: string, expiresAt: string): UsePostExpiryResult {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = getTimeRemaining(expiresAt, now);
  return {
    remaining,
    fraction: getRemainingFraction(createdAt, expiresAt, now),
    label: formatTimeRemaining(remaining),
    expired: remaining.expired,
  };
}
