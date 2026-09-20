/**
 * Postgres store (Supabase / Neon). Active when DATABASE_URL is set.
 * Uses postgres.js (no ORM). Aggregates (post.pumped, user.received/given) are
 * updated transactionally inside recordPump.
 */
import postgres from "postgres";
import { randomUUID } from "node:crypto";
import type {
  CommentWithAuthor,
  FeedQuery,
  LeaderboardQuery,
  PostWithAuthor,
  Pump,
  PumpWithAuthor,
  Store,
  User,
} from "./types";

type Sql = ReturnType<typeof postgres>;

let sql: Sql | null = null;
function getSql(): Sql {
  if (!sql) {
    const url = process.env.DATABASE_URL!;
    sql = postgres(url, {
      ssl: url.includes("sslmode=require") ? "require" : undefined,
      max: 5,
    });
  }
  return sql;
}

// Postgres.js returns loosely-typed rows; we map them explicitly below.
type Row = Record<string, any>;

function rowToUser(r: Row): User {
  return {
    id: r.id,
    handle: r.handle,
    wallet: r.wallet,
    bio: r.bio,
    country: r.country,
    createdAt: Number(r.created_at),
    received: Number(r.received),
    given: Number(r.given),
    hidePumpHistory: r.hide_pump_history,
    anonymizePumps: r.anonymize_pumps,
  };
}

function rowToPostWithAuthor(r: Row): PostWithAuthor {
  return {
    id: r.id,
    userId: r.user_id,
    text: r.text,
    mediaUrl: r.media_url,
    mediaType: r.media_type,
    createdAt: Number(r.created_at),
    pumped: Number(r.pumped),
    comments: r.comments,
    reposts: r.reposts,
    likes: r.likes,
    country: r.country,
    tags: r.tags ?? [],
    author: { id: r.author_id, handle: r.author_handle, wallet: r.author_wallet, bio: r.author_bio },
  };
}

export function createPostgresStore(): Store {
  return {
    async getUserById(id) {
      const db = getSql();
      const rows = await db`select * from users where id = ${id} limit 1`;
      return rows[0] ? rowToUser(rows[0]) : null;
    },
    async getUserByWallet(wallet) {
      const db = getSql();
      const rows = await db`select * from users where wallet = ${wallet} limit 1`;
      return rows[0] ? rowToUser(rows[0]) : null;
    },
    async getUserByHandle(handle) {
      const db = getSql();
      const rows = await db`select * from users where lower(handle) = ${handle.toLowerCase()} limit 1`;
      return rows[0] ? rowToUser(rows[0]) : null;
    },
    async createUser({ handle, wallet, bio = "", country = "FR" }) {
      const db = getSql();
      const id = randomUUID();
      const rows = await db`
        insert into users (id, handle, wallet, bio, country, created_at)
        values (${id}, ${handle}, ${wallet}, ${bio || "Nouveau sur pump.social 👋"}, ${country}, ${Date.now()})
        returning *`;
      return rowToUser(rows[0]);
    },
    async updateUser(id, patch) {
      const db = getSql();
      const rows = await db`
        update users set
          bio = coalesce(${patch.bio ?? null}, bio),
          handle = coalesce(${patch.handle ?? null}, handle),
          hide_pump_history = coalesce(${patch.hidePumpHistory ?? null}, hide_pump_history),
          anonymize_pumps = coalesce(${patch.anonymizePumps ?? null}, anonymize_pumps)
        where id = ${id}
        returning *`;
      if (!rows[0]) throw new Error("user not found");
      return rowToUser(rows[0]);
    },

    async createPost({ userId, text, mediaUrl = null, mediaType = null, country = "FR", tags = [] }) {
      const db = getSql();
      const id = randomUUID();
      const rows = await db`
        insert into posts (id, user_id, text, media_url, media_type, created_at, country, tags)
        values (${id}, ${userId}, ${text}, ${mediaUrl}, ${mediaType}, ${Date.now()}, ${country}, ${db.array(tags)})
        returning *`;
      const r = rows[0];
      return {
        id: r.id,
        userId: r.user_id,
        text: r.text,
        mediaUrl: r.media_url,
        mediaType: r.media_type,
        createdAt: Number(r.created_at),
        pumped: Number(r.pumped),
        comments: r.comments,
        reposts: r.reposts,
        likes: r.likes,
        country: r.country,
        tags: r.tags ?? [],
      };
    },
    async getPost(id) {
      const db = getSql();
      const rows = await db`
        select p.*, u.id as author_id, u.handle as author_handle, u.wallet as author_wallet, u.bio as author_bio
        from posts p join users u on u.id = p.user_id
        where p.id = ${id} limit 1`;
      return rows[0] ? rowToPostWithAuthor(rows[0]) : null;
    },
    async listPosts(q: FeedQuery) {
      const db = getSql();
      const order =
        q.tab === "foryou"
          ? db`order by p.pumped desc`
          : db`order by p.created_at desc`;
      const rows = await db`
        select p.*, u.id as author_id, u.handle as author_handle, u.wallet as author_wallet, u.bio as author_bio
        from posts p join users u on u.id = p.user_id
        where true
          ${q.authorId ? db`and p.user_id = ${q.authorId}` : db``}
          ${q.before ? db`and p.created_at < ${q.before}` : db``}
        ${order}
        limit ${q.limit}`;
      return rows.map(rowToPostWithAuthor);
    },

    async recordPump({ postId, pumperUserId, amount, creatorAmount, founderAmount, signature, anonymous }) {
      const db = getSql();
      return db.begin(async (tx) => {
        const id = randomUUID();
        const pumpRows = await tx`
          insert into pumps (id, post_id, pumper_user_id, amount, creator_amount, founder_amount, signature, anonymous, created_at)
          values (${id}, ${postId}, ${pumperUserId}, ${amount}, ${creatorAmount}, ${founderAmount}, ${signature}, ${anonymous}, ${Date.now()})
          returning *`;
        const postRows = await tx`
          update posts set pumped = pumped + ${amount} where id = ${postId} returning *`;
        if (!postRows[0]) throw new Error("post not found");
        await tx`update users set received = received + ${creatorAmount} where id = ${postRows[0].user_id}`;
        await tx`update users set given = given + ${amount} where id = ${pumperUserId}`;
        const pr = pumpRows[0];
        const pump: Pump = {
          id: pr.id,
          postId: pr.post_id,
          pumperUserId: pr.pumper_user_id,
          amount: Number(pr.amount),
          creatorAmount: Number(pr.creator_amount),
          founderAmount: Number(pr.founder_amount),
          signature: pr.signature,
          anonymous: pr.anonymous,
          createdAt: Number(pr.created_at),
        };
        const p = postRows[0];
        return {
          pump,
          post: {
            id: p.id,
            userId: p.user_id,
            text: p.text,
            mediaUrl: p.media_url,
            mediaType: p.media_type,
            createdAt: Number(p.created_at),
            pumped: Number(p.pumped),
            comments: p.comments,
            reposts: p.reposts,
            likes: p.likes,
            country: p.country,
            tags: p.tags ?? [],
          },
        };
      });
    },
    async getPumpBySignature(signature) {
      const db = getSql();
      const rows = await db`select * from pumps where signature = ${signature} limit 1`;
      if (!rows[0]) return null;
      const r = rows[0];
      return {
        id: r.id,
        postId: r.post_id,
        pumperUserId: r.pumper_user_id,
        amount: Number(r.amount),
        creatorAmount: Number(r.creator_amount),
        founderAmount: Number(r.founder_amount),
        signature: r.signature,
        anonymous: r.anonymous,
        createdAt: Number(r.created_at),
      };
    },
    async listPumpers(postId) {
      const db = getSql();
      const rows = await db`
        select pm.*, u.id as author_id, u.handle as author_handle, u.wallet as author_wallet
        from pumps pm join users u on u.id = pm.pumper_user_id
        where pm.post_id = ${postId}
        order by pm.created_at desc`;
      return rows.map(
        (r): PumpWithAuthor => ({
          id: r.id,
          postId: r.post_id,
          pumperUserId: r.pumper_user_id,
          amount: Number(r.amount),
          creatorAmount: Number(r.creator_amount),
          founderAmount: Number(r.founder_amount),
          signature: r.signature,
          anonymous: r.anonymous,
          createdAt: Number(r.created_at),
          author: { id: r.author_id, handle: r.author_handle, wallet: r.author_wallet },
        }),
      );
    },

    async addComment({ postId, userId, text }) {
      const db = getSql();
      const id = randomUUID();
      const rows = await db.begin(async (tx) => {
        const c = await tx`
          insert into comments (id, post_id, user_id, text, created_at)
          values (${id}, ${postId}, ${userId}, ${text}, ${Date.now()})
          returning *`;
        await tx`update posts set comments = comments + 1 where id = ${postId}`;
        return c;
      });
      const r = rows[0];
      return {
        id: r.id,
        postId: r.post_id,
        userId: r.user_id,
        text: r.text,
        createdAt: Number(r.created_at),
      };
    },
    async listComments(postId) {
      const db = getSql();
      const rows = await db`
        select c.*, u.id as author_id, u.handle as author_handle, u.wallet as author_wallet
        from comments c join users u on u.id = c.user_id
        where c.post_id = ${postId}
        order by c.created_at desc`;
      return rows.map(
        (r): CommentWithAuthor => ({
          id: r.id,
          postId: r.post_id,
          userId: r.user_id,
          text: r.text,
          createdAt: Number(r.created_at),
          author: { id: r.author_id, handle: r.author_handle, wallet: r.author_wallet },
        }),
      );
    },

    async leaderboardPosts(q: LeaderboardQuery) {
      const db = getSql();
      const rows = await db`
        select p.*, u.id as author_id, u.handle as author_handle, u.wallet as author_wallet, u.bio as author_bio
        from posts p join users u on u.id = p.user_id
        where true ${q.scope === "country" && q.country ? db`and p.country = ${q.country}` : db``}
        order by p.pumped desc
        limit ${q.limit} offset ${q.offset}`;
      return rows.map(rowToPostWithAuthor);
    },
    async leaderboardCreators(q: LeaderboardQuery) {
      const db = getSql();
      const rows = await db`
        select * from users
        where true ${q.scope === "country" && q.country ? db`and country = ${q.country}` : db``}
        order by received desc
        limit ${q.limit} offset ${q.offset}`;
      return rows.map(rowToUser);
    },
  };
}
