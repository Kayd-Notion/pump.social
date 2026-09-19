'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/Input';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { fetchCountries } from '@/lib/indexer/api';
import type { Country } from '@/lib/indexer/mock-data';

/** Explore — search entry point, trending (top board) and country shortcuts. */
export default function ExplorePage() {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  return (
    <>
      <PageHeader title="Explore" subtitle="Discover what's pumping" />

      <div className="p-4">
        <Link href="/explore/search">
          <Input placeholder="Search posts and people" readOnly className="cursor-pointer" />
        </Link>
      </div>

      <div className="px-4">
        <h2 className="mb-1 text-sm font-semibold text-neutral-500">Browse by country</h2>
        <div className="flex flex-wrap gap-2 pb-2">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={`/leaderboard/${c.code}`}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:border-accent dark:border-neutral-700"
            >
              {c.flag} {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <h2 className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold dark:border-neutral-800">
          🔥 Trending worldwide
        </h2>
        <LeaderboardTable />
      </div>
    </>
  );
}
