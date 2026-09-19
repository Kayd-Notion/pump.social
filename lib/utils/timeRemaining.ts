/** Helpers for computing and formatting post expiry countdowns. */

export interface TimeRemaining {
  /** Total milliseconds left; 0 when expired. */
  ms: number;
  expired: boolean;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Compute the time remaining between now (or `now`) and an ISO deadline. */
export function getTimeRemaining(expiresAt: string, now: number = Date.now()): TimeRemaining {
  const deadline = new Date(expiresAt).getTime();
  const ms = Math.max(0, deadline - now);
  const totalSeconds = Math.floor(ms / 1000);
  return {
    ms,
    expired: ms <= 0,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Format remaining time compactly, e.g. `23h 12m`, `4m 05s`, `Expired`. */
export function formatTimeRemaining(remaining: TimeRemaining): string {
  if (remaining.expired) return 'Expired';
  const { hours, minutes, seconds } = remaining;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  return `${seconds}s`;
}

/**
 * Fraction (0..1) of the lifetime still remaining, given the full window
 * between publication and expiry. Used to size the expiry gauge.
 */
export function getRemainingFraction(
  createdAt: string,
  expiresAt: string,
  now: number = Date.now(),
): number {
  const start = new Date(createdAt).getTime();
  const end = new Date(expiresAt).getTime();
  const total = end - start;
  if (total <= 0) return 0;
  const left = end - now;
  return Math.min(1, Math.max(0, left / total));
}

/** Format an ISO timestamp as a short relative age, e.g. `3h`, `2d`. */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${Math.max(0, seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
