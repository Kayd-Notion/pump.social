import type { FeedTab, Post, Pump, ProfileStats, User } from '@/types';
import { LEADERBOARD_SIZE } from '@/lib/config';
import {
  COUNTRIES,
  MOCK_POSTS,
  MOCK_PUMPS,
  MOCK_USERS,
  findUserByUsername,
  type Country,
} from './mock-data';

/**
 * Read-side API. Today this reads from local mock fixtures; when the real
 * indexing service ships, only this file needs to change (swap the bodies
 * for `fetch` calls) — callers keep the same async signatures.
 */

/** Simulate network latency so loading states are exercised. */
const LATENCY_MS = 250;
function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface LeaderboardEntry {
  rank: number;
  post: Post;
}

/** Fetch a feed for the given tab. */
export async function fetchFeed(tab: FeedTab = 'for-you'): Promise<Post[]> {
  const posts = [...MOCK_POSTS];
  switch (tab) {
    case 'for-you':
      // Blend of recency and pump volume.
      posts.sort(
        (a, b) =>
          b.totalPumped + ageScore(b) - (a.totalPumped + ageScore(a)),
      );
      break;
    case 'following':
      // Mock "following" = a stable subset of authors.
      return delay(
        posts
          .filter((p) => FOLLOWED_AUTHORS.has(p.author.username))
          .sort(byNewest),
      );
    case 'live':
      posts.sort(byNewest);
      break;
  }
  return delay(posts);
}

const FOLLOWED_AUTHORS = new Set(['sol_sensei', 'satoshigirl', 'ada_lovelace']);

function byNewest(a: Post, b: Post): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function ageScore(post: Post): number {
  const ageHours = (Date.now() - new Date(post.createdAt).getTime()) / 3_600_000;
  return Math.max(0, 100 - ageHours);
}

/** Fetch a single post by id. */
export async function fetchPost(postId: string): Promise<Post | null> {
  return delay(MOCK_POSTS.find((p) => p.id === postId) ?? null);
}

/** Fetch recent pumps for a post, newest first. */
export async function fetchPumps(postId: string): Promise<Pump[]> {
  return delay(
    MOCK_PUMPS.filter((p) => p.postId === postId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );
}

/**
 * Worldwide or per-country leaderboard, ranked by all-time cumulative pump
 * total. Pass a country code to scope it.
 */
export async function fetchLeaderboard(countryCode?: string): Promise<LeaderboardEntry[]> {
  const scoped = countryCode
    ? MOCK_POSTS.filter((p) => p.countryCode === countryCode)
    : [...MOCK_POSTS];
  const ranked = scoped
    .sort((a, b) => b.totalPumped - a.totalPumped)
    .slice(0, LEADERBOARD_SIZE)
    .map((post, i) => ({ rank: i + 1, post }));
  return delay(ranked);
}

/** Fetch a user profile by username. */
export async function fetchProfile(username: string): Promise<User | null> {
  return delay(findUserByUsername(username) ?? null);
}

/** Fetch a user's posts by username. */
export async function fetchUserPosts(username: string): Promise<Post[]> {
  return delay(MOCK_POSTS.filter((p) => p.author.username === username).sort(byNewest));
}

/** Aggregate profile stats. */
export async function fetchProfileStats(username: string): Promise<ProfileStats | null> {
  const user = findUserByUsername(username);
  if (!user) return delay(null);
  const posts = MOCK_POSTS.filter((p) => p.author.username === username);
  return delay({
    posts: posts.length,
    followers: user.followers,
    following: user.following,
    totalPumpedReceived: posts.reduce((sum, p) => sum + p.totalPumped, 0),
  });
}

/** List of countries that have leaderboard data. */
export async function fetchCountries(): Promise<Country[]> {
  return delay([...COUNTRIES]);
}

/** Simple text search across posts and users (mock). */
export async function search(query: string): Promise<{ posts: Post[]; users: User[] }> {
  const q = query.trim().toLowerCase();
  if (!q) return delay({ posts: [], users: [] });
  return delay({
    posts: MOCK_POSTS.filter((p) => p.text.toLowerCase().includes(q)),
    users: MOCK_USERS.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        (u.displayName?.toLowerCase().includes(q) ?? false),
    ),
  });
}

export type { Country };
