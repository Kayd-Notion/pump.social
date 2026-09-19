import type { PumpSplit } from '@/types';

/**
 * Product-wide constants. These mirror rules that will ultimately be
 * enforced by the smart contract; they live here so the UI has a single
 * source of truth while the on-chain program is still being built.
 */

/** Split shown to users before they confirm a pump (~70% creator / ~30% pool). */
export const PUMP_SPLIT: PumpSplit = {
  creatorShare: 0.7,
  poolShare: 0.3,
};

/** Predefined quick-pump amounts, in SOL. */
export const QUICK_PUMP_AMOUNTS: readonly number[] = [0.01, 0.1, 1];

/** Minimum pump amount accepted by the UI, in SOL. */
export const MIN_PUMP_AMOUNT = 0.001;

/** Minimum lifetime of a post after publication, in hours. */
export const MIN_POST_LIFETIME_HOURS = 24;

/** Leaderboard size, both worldwide and per country. */
export const LEADERBOARD_SIZE = 30;

/** Supported Solana clusters. */
export type SolanaCluster = 'mainnet-beta' | 'testnet' | 'devnet';

/** Solana cluster the app talks to (mock defaults to devnet). */
export const SOLANA_CLUSTER: SolanaCluster = 'devnet';
