import type { User } from './user';

export type MediaType = 'image' | 'video';

export interface PostMedia {
  type: MediaType;
  url: string;
  /** Optional poster/thumbnail for videos. */
  posterUrl?: string;
  /** Accessible description of the media. */
  alt?: string;
}

/** A single feed item. Money-related figures are denominated in SOL. */
export interface Post {
  id: string;
  author: User;
  text: string;
  media?: PostMedia;
  /** ISO timestamp of publication. */
  createdAt: string;
  /**
   * ISO timestamp when the post expires. Always at least 24h after
   * `createdAt`; extended in tiers every time the post is pumped.
   */
  expiresAt: string;
  /** Total SOL pumped into this post since it was created. */
  totalPumped: number;
  /** Number of distinct pump transactions. */
  pumpCount: number;
  commentCount: number;
  /** ISO 3166-1 alpha-2 country code the post is attributed to. */
  countryCode: string;
  /** Whether the current viewer has already pumped this post (mock). */
  pumpedByViewer?: boolean;
}

/** A feed of posts, whichever tab it came from. */
export type FeedTab = 'for-you' | 'following' | 'live';
