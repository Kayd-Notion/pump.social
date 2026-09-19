import type { User } from './user';

/** A single pump (financial sponsorship) applied to a post. */
export interface Pump {
  id: string;
  postId: string;
  from: User;
  /** SOL amount pumped. */
  amount: number;
  /** ISO timestamp. */
  createdAt: string;
}

/**
 * How a pump is split. The real split is enforced by the smart contract;
 * the frontend only displays it so the user can review before signing.
 */
export interface PumpSplit {
  /** Share (0..1) that goes to the post creator. */
  creatorShare: number;
  /** Share (0..1) that goes to the shared reward pool. */
  poolShare: number;
}

/** Result of a (currently mocked) pump transaction. */
export interface PumpResult {
  success: boolean;
  /** Transaction signature, when successful. */
  signature?: string;
  /** New running total for the post after the pump. */
  newTotalPumped: number;
  /** Human-readable error, when unsuccessful. */
  error?: string;
}
