/** A user of the network, identified on-chain by a Solana wallet address. */
export interface User {
  /** Stable id (mock uses the wallet address). */
  id: string;
  /** Base58 Solana wallet public key. */
  walletAddress: string;
  /** Chosen pseudo, picked during onboarding. Absent until onboarded. */
  username: string;
  /** Free-form display name; falls back to username in the UI. */
  displayName?: string;
  /** Avatar image URL. */
  avatarUrl?: string;
  /** Short profile bio. */
  bio?: string;
  /** ISO 3166-1 alpha-2 country code, used for country leaderboards. */
  countryCode?: string;
  followers: number;
  following: number;
  /** ISO timestamp of first connection. */
  createdAt: string;
}

/** Aggregated, display-ready stats shown on a profile header. */
export interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
  /** Total SOL this user has received across all of their posts. */
  totalPumpedReceived: number;
}
