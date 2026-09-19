/** Formatting helpers for SOL amounts and wallet addresses. */

/**
 * Format a SOL amount for display. Trims trailing zeros but keeps enough
 * precision to show small pumps (e.g. 0.01 SOL).
 */
export function formatSol(amount: number, maxFractionDigits = 3): string {
  if (!Number.isFinite(amount)) return '0';
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
  return formatted;
}

/** Format a SOL amount with its ticker, e.g. `1.5 SOL`. */
export function formatSolWithSymbol(amount: number, maxFractionDigits = 3): string {
  return `${formatSol(amount, maxFractionDigits)} SOL`;
}

/**
 * Compact large numbers for counters (e.g. 12.3K, 1.2M). Used for pump
 * totals and follower counts.
 */
export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Shorten a base58 wallet address, e.g. `7xKX…s9Qm`. */
export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
