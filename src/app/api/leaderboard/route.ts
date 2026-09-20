import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { publicUser } from "@/lib/current-user";
import { countryFromRequest, normalizeCountry } from "@/lib/geo";
import type { LeaderboardKind, LeaderboardScope } from "@/lib/db/types";

export const runtime = "nodejs";

/**
 * Two leaderboards (posts by total pumped, creators by total received), each
 * world or by-country, with offset-based infinite scroll. Country defaults to
 * the requester's IP-derived country (never stored), overridable via ?country=.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const kind = (sp.get("kind") as LeaderboardKind) === "creators" ? "creators" : "posts";
  const scope: LeaderboardScope = sp.get("scope") === "country" ? "country" : "world";
  const limit = Math.min(Number(sp.get("limit")) || 20, 50);
  const offset = Math.max(0, Number(sp.get("offset")) || 0);

  // Live geo from IP for the default country; explicit ?country= wins.
  const country =
    scope === "country"
      ? normalizeCountry(sp.get("country") || countryFromRequest(req))
      : undefined;

  const store = getStore();
  if (kind === "creators") {
    const users = await store.leaderboardCreators({ kind, scope, country, limit, offset });
    return NextResponse.json({
      kind,
      scope,
      country: country ?? null,
      items: users.map(publicUser),
      nextOffset: users.length === limit ? offset + limit : null,
    });
  }

  const posts = await store.leaderboardPosts({ kind, scope, country, limit, offset });
  return NextResponse.json({
    kind,
    scope,
    country: country ?? null,
    items: posts,
    nextOffset: posts.length === limit ? offset + limit : null,
  });
}
