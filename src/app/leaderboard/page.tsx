"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { api } from "@/lib/api";
import { useUI } from "@/context/UIContext";
import { KNOWN_COUNTRIES } from "@/lib/geo-client";
import { fmtSol } from "@/lib/format";
import type { ClientPost, ClientUser } from "@/lib/client-types";

export default function LeaderboardPage() {
  const router = useRouter();
  const { dataVersion } = useUI();
  const [kind, setKind] = useState<"posts" | "creators">("posts");
  const [scope, setScope] = useState<"world" | "country">("world");
  const [country, setCountry] = useState("FR");
  const [items, setItems] = useState<(ClientPost | ClientUser)[]>([]);
  const [offset, setOffset] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const sentinel = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Default the country selector to the viewer's IP-derived country.
  useEffect(() => {
    api.geo().then((r) => setCountry(r.country)).catch(() => {});
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.leaderboard({ kind, scope, country: scope === "country" ? country : undefined, offset: 0 });
      setItems(res.items);
      setOffset(res.nextOffset);
    } catch {
      setItems([]);
      setOffset(null);
    } finally {
      setLoading(false);
    }
  }, [kind, scope, country]);

  useEffect(() => {
    reload();
  }, [reload, dataVersion]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || offset === null) return;
    loadingRef.current = true;
    try {
      const res = await api.leaderboard({
        kind,
        scope,
        country: scope === "country" ? country : undefined,
        offset,
      });
      setItems((prev) => [...prev, ...res.items]);
      setOffset(res.nextOffset);
    } finally {
      loadingRef.current = false;
    }
  }, [kind, scope, country, offset]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => e[0].isIntersecting && loadMore(),
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <section>
      <div className="tabs">
        <div className={`tab${kind === "posts" ? " active" : ""}`} onClick={() => setKind("posts")}>
          Posts
        </div>
        <div className={`tab${kind === "creators" ? " active" : ""}`} onClick={() => setKind("creators")}>
          Créateurs
        </div>
      </div>

      <div className="lb-controls">
        <div className="seg">
          <button className={`chip${scope === "world" ? " active" : ""}`} onClick={() => setScope("world")}>
            🌍 Mondial
          </button>
          <button className={`chip${scope === "country" ? " active" : ""}`} onClick={() => setScope("country")}>
            📍 Par pays
          </button>
        </div>
        {scope === "country" && (
          <select className="field" value={country} onChange={(e) => setCountry(e.target.value)}>
            {[...KNOWN_COUNTRIES].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner" style={{ color: "var(--accent)" }} /> Chargement…
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="ico">🏆</div>
          Aucune entrée pour ce filtre.
        </div>
      ) : kind === "posts" ? (
        (items as ClientPost[]).map((p, i) => (
          <div
            key={p.id}
            className={`lb-row${i < 3 ? " top" + (i + 1) : ""}`}
            onClick={() => router.push(`/post/${p.id}`)}
          >
            <div className="lb-rank">{i + 1}</div>
            <Avatar id={p.author.id} handle={p.author.handle} size="sm" />
            <div className="lb-info">
              <div className="lb-name">
                {p.text.slice(0, 42)}
                {p.text.length > 42 ? "…" : ""}
              </div>
              <div className="lb-sub">
                {p.author.handle} · @{p.author.handle}
              </div>
            </div>
            <div className="lb-amount">
              ⚡ {fmtSol(p.pumped)}
              <small>SOL</small>
            </div>
          </div>
        ))
      ) : (
        (items as ClientUser[]).map((u, i) => (
          <div
            key={u.id}
            className={`lb-row${i < 3 ? " top" + (i + 1) : ""}`}
            onClick={() => router.push(`/profile/${u.handle}`)}
          >
            <div className="lb-rank">{i + 1}</div>
            <Avatar id={u.id} handle={u.handle} size="sm" />
            <div className="lb-info">
              <div className="lb-name">{u.handle}</div>
              <div className="lb-sub">@{u.handle}</div>
            </div>
            <div className="lb-amount">
              ⚡ {fmtSol(u.received)}
              <small>reçus</small>
            </div>
          </div>
        ))
      )}
      <div ref={sentinel} />
    </section>
  );
}
