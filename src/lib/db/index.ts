import "server-only";
import { createMemoryStore } from "./memory";
import { createPostgresStore } from "./postgres";
import type { Store } from "./types";

/**
 * Single data-access entry point. Picks the storage backend from env:
 *  - DATABASE_URL set  → Postgres (Supabase / Neon)
 *  - otherwise         → file-backed dev store (seeded), so the app runs locally
 *
 * Kept behind the `Store` interface so swapping backends never touches callers.
 */
let store: Store | null = null;

export function getStore(): Store {
  if (store) return store;
  store = process.env.DATABASE_URL ? createPostgresStore() : createMemoryStore();
  return store;
}

export const USING_POSTGRES = Boolean(process.env.DATABASE_URL);

export type { Store } from "./types";
