/**
 * File-backed in-memory store — the default when DATABASE_URL is unset.
 *
 * Persists a single JSON snapshot to `.data/db.json` so data survives dev-server
 * reloads. This is NOT for production (no concurrency guarantees); it exists so
 * the whole app runs and is testable locally without provisioning Postgres.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { buildSeed } from "./seed";
import type {
  Comment,
  CommentWithAuthor,
  FeedQuery,
  LeaderboardQuery,
  Post,
  PostWithAuthor,
  Pump,
  PumpWithAuthor,
  Store,
  User,
} from "./types";

interface DbShape {
  users: User[];
  posts: Post[];
  comments: Comment[];
  pumps: Pump[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

let db: DbShape | null = null;
let loading: Promise<DbShape> | null = null;
let writeChain: Promise<void> = Promise.resolve();

async function load(): Promise<DbShape> {
  if (db) return db;
  if (loading) return loading;
  loading = (async () => {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf8");
      db = JSON.parse(raw) as DbShape;
    } catch {
      db = buildSeed();
      await persistNow(db);
    }
    return db;
  })();
  return loading;
}

async function persistNow(snapshot: DbShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(snapshot, null, 2), "utf8");
}

function persist(): void {
  // Serialize writes to avoid interleaved file writes clobbering each other.
  writeChain = writeChain.then(() => (db ? persistNow(db) : Promise.resolve()));
}

function authorOf(u: User) {
  return { id: u.id, handle: u.handle, wallet: u.wallet, bio: u.bio };
}

export function createMemoryStore(): Store {
  const findUser = (d: DbShape, id: string) => d.users.find((u) => u.id === id) || null;

  return {
    async getUserById(id) {
      const d = await load();
      return findUser(d, id);
    },
    async getUserByWallet(wallet) {
      const d = await load();
      return d.users.find((u) => u.wallet === wallet) || null;
    },
    async getUserByHandle(handle) {
      const d = await load();
      const h = handle.toLowerCase();
      return d.users.find((u) => u.handle.toLowerCase() === h) || null;
    },
    async createUser({ handle, wallet, bio = "", country = "FR" }) {
      const d = await load();
      const user: User = {
        id: randomUUID(),
        handle,
        wallet,
        bio: bio || "Nouveau sur pump.social 👋",
        country,
        createdAt: Date.now(),
        received: 0,
        given: 0,
        hidePumpHistory: false,
        anonymizePumps: false,
      };
      d.users.push(user);
      persist();
      return user;
    },
    async updateUser(id, patch) {
      const d = await load();
      const u = findUser(d, id);
      if (!u) throw new Error("user not found");
      Object.assign(u, patch);
      persist();
      return u;
    },

    async createPost({ userId, text, mediaUrl = null, mediaType = null, country = "FR", tags = [] }) {
      const d = await load();
      const post: Post = {
        id: randomUUID(),
        userId,
        text,
        mediaUrl,
        mediaType,
        createdAt: Date.now(),
        pumped: 0,
        comments: 0,
        reposts: 0,
        likes: 0,
        country,
        tags,
      };
      d.posts.push(post);
      persist();
      return post;
    },
    async getPost(id) {
      const d = await load();
      const p = d.posts.find((x) => x.id === id);
      if (!p) return null;
      const author = findUser(d, p.userId);
      if (!author) return null;
      return { ...p, author: authorOf(author) };
    },
    async listPosts(q: FeedQuery) {
      const d = await load();
      let list = d.posts.slice();
      if (q.authorId) list = list.filter((p) => p.userId === q.authorId);
      if (q.before) list = list.filter((p) => p.createdAt < q.before!);

      if (q.tab === "live") {
        list.sort((a, b) => b.createdAt - a.createdAt);
      } else if (q.tab === "foryou") {
        list.sort((a, b) => b.pumped - a.pumped);
      } else {
        // "following" and default: most recent first
        list.sort((a, b) => b.createdAt - a.createdAt);
      }
      list = list.slice(0, q.limit);
      return list
        .map((p) => {
          const author = findUser(d, p.userId);
          return author ? { ...p, author: authorOf(author) } : null;
        })
        .filter((x): x is PostWithAuthor => x !== null);
    },

    async recordPump({ postId, pumperUserId, amount, creatorAmount, founderAmount, signature, anonymous }) {
      const d = await load();
      const post = d.posts.find((p) => p.id === postId);
      if (!post) throw new Error("post not found");
      if (d.pumps.some((p) => p.signature === signature)) {
        throw new Error("duplicate signature");
      }
      const pump: Pump = {
        id: randomUUID(),
        postId,
        pumperUserId,
        amount,
        creatorAmount,
        founderAmount,
        signature,
        anonymous,
        createdAt: Date.now(),
      };
      d.pumps.push(pump);
      // Aggregates: post total, creator received, pumper given.
      post.pumped += amount;
      const creator = findUser(d, post.userId);
      if (creator) creator.received += creatorAmount;
      const pumper = findUser(d, pumperUserId);
      if (pumper) pumper.given += amount;
      persist();
      return { pump, post: { ...post } };
    },
    async getPumpBySignature(signature) {
      const d = await load();
      return d.pumps.find((p) => p.signature === signature) || null;
    },
    async listPumpers(postId) {
      const d = await load();
      return d.pumps
        .filter((p) => p.postId === postId)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((p) => {
          const author = findUser(d, p.pumperUserId);
          return author
            ? { ...p, author: { id: author.id, handle: author.handle, wallet: author.wallet } }
            : null;
        })
        .filter((x): x is PumpWithAuthor => x !== null);
    },

    async addComment({ postId, userId, text }) {
      const d = await load();
      const post = d.posts.find((p) => p.id === postId);
      if (!post) throw new Error("post not found");
      const comment: Comment = {
        id: randomUUID(),
        postId,
        userId,
        text,
        createdAt: Date.now(),
      };
      d.comments.push(comment);
      post.comments += 1;
      persist();
      return comment;
    },
    async listComments(postId) {
      const d = await load();
      return d.comments
        .filter((c) => c.postId === postId)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((c) => {
          const author = findUser(d, c.userId);
          return author
            ? { ...c, author: { id: author.id, handle: author.handle, wallet: author.wallet } }
            : null;
        })
        .filter((x): x is CommentWithAuthor => x !== null);
    },

    async leaderboardPosts(q: LeaderboardQuery) {
      const d = await load();
      let list = d.posts.slice();
      if (q.scope === "country" && q.country) list = list.filter((p) => p.country === q.country);
      list.sort((a, b) => b.pumped - a.pumped);
      list = list.slice(q.offset, q.offset + q.limit);
      return list
        .map((p) => {
          const author = findUser(d, p.userId);
          return author ? { ...p, author: authorOf(author) } : null;
        })
        .filter((x): x is PostWithAuthor => x !== null);
    },
    async leaderboardCreators(q: LeaderboardQuery) {
      const d = await load();
      let list = d.users.slice();
      if (q.scope === "country" && q.country) list = list.filter((u) => u.country === q.country);
      list.sort((a, b) => b.received - a.received);
      return list.slice(q.offset, q.offset + q.limit);
    },
  };
}
