import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { publicUser } from "@/lib/current-user";
import { lifespanInfo } from "@/lib/lifespan";

export const runtime = "nodejs";

/** Public profile + the user's posts (active/expired split). */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const store = getStore();
  const user = await store.getUserByHandle(handle);
  if (!user) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

  const posts = await store.listPosts({ limit: 100, authorId: user.id, tab: "live" });
  const now = Date.now();
  const active = posts.filter((p) => !lifespanInfo(p.createdAt, p.pumped, now).expired);
  const expired = posts.filter((p) => lifespanInfo(p.createdAt, p.pumped, now).expired);

  const pub = publicUser(user);
  return NextResponse.json({
    user: pub,
    postsCount: posts.length,
    active,
    expired,
  });
}
