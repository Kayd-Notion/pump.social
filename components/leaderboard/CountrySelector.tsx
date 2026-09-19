'use client';

import { useRouter } from 'next/navigation';
import { COUNTRIES } from '@/lib/indexer/mock-data';

export interface CountrySelectorProps {
  /** Currently selected country code, or undefined for worldwide. */
  value?: string;
}

const WORLDWIDE = 'worldwide';

/**
 * Switches the leaderboard scope between worldwide and a specific country.
 * Navigates to the matching route so each scope is a shareable static page.
 */
export function CountrySelector({ value }: CountrySelectorProps) {
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-neutral-500">Region</span>
      <select
        value={value ?? WORLDWIDE}
        onChange={(e) => {
          const code = e.target.value;
          router.push(code === WORLDWIDE ? '/leaderboard' : `/leaderboard/${code}`);
        }}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-accent dark:border-neutral-700 dark:bg-neutral-900"
      >
        <option value={WORLDWIDE}>🌍 Worldwide</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
