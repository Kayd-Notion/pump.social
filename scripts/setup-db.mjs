/**
 * Apply the Postgres schema and (optionally) seed it.
 *
 * Usage:
 *   DATABASE_URL="postgres://..." node scripts/setup-db.mjs        # schema only
 *   DATABASE_URL="postgres://..." node scripts/setup-db.mjs --seed # schema + seed
 *
 * Safe to re-run: schema uses IF NOT EXISTS; seeding is skipped when users exist.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { buildSeed } from "../src/lib/db/seed.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const sql = postgres(url, { ssl: url.includes("sslmode=require") ? "require" : undefined });

const schema = await readFile(path.join(__dirname, "../src/db/schema.sql"), "utf8");
await sql.unsafe(schema);
console.log("✓ schema applied");

if (process.argv.includes("--seed")) {
  const [{ count }] = await sql`select count(*)::int as count from users`;
  if (count > 0) {
    console.log(`• users already present (${count}) — skipping seed`);
  } else {
    const { users, posts, comments, pumps } = buildSeed();
    for (const u of users) {
      await sql`insert into users (id, handle, wallet, bio, country, created_at, received, given)
        values (${u.id}, ${u.handle}, ${u.wallet}, ${u.bio}, ${u.country}, ${u.createdAt}, ${u.received}, ${u.given})`;
    }
    for (const p of posts) {
      await sql`insert into posts (id, user_id, text, media_url, media_type, created_at, pumped, comments, reposts, likes, country, tags)
        values (${p.id}, ${p.userId}, ${p.text}, ${p.mediaUrl}, ${p.mediaType}, ${p.createdAt}, ${p.pumped}, ${p.comments}, ${p.reposts}, ${p.likes}, ${p.country}, ${sql.array(p.tags)})`;
    }
    for (const c of comments) {
      await sql`insert into comments (id, post_id, user_id, text, created_at)
        values (${c.id}, ${c.postId}, ${c.userId}, ${c.text}, ${c.createdAt})`;
    }
    for (const pm of pumps) {
      await sql`insert into pumps (id, post_id, pumper_user_id, amount, creator_amount, founder_amount, signature, anonymous, created_at)
        values (${pm.id}, ${pm.postId}, ${pm.pumperUserId}, ${pm.amount}, ${pm.creatorAmount}, ${pm.founderAmount}, ${pm.signature}, ${pm.anonymous}, ${pm.createdAt})`;
    }
    console.log(`✓ seeded ${users.length} users, ${posts.length} posts, ${comments.length} comments, ${pumps.length} pumps`);
  }
}

await sql.end();
console.log("done.");
