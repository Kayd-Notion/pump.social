import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { CountrySelector } from '@/components/leaderboard/CountrySelector';
import { COUNTRIES } from '@/lib/indexer/mock-data';
import { LEADERBOARD_SIZE } from '@/lib/config';

interface Params {
  country: string;
}

/** Pre-render one static page per supported country (required for export). */
export function generateStaticParams(): Params[] {
  return COUNTRIES.map((c) => ({ country: c.code }));
}

// Only the country codes above exist; anything else 404s at build time.
export const dynamicParams = false;

/** Per-country leaderboard. */
export default function CountryLeaderboardPage({ params }: { params: Params }) {
  const country = COUNTRIES.find((c) => c.code === params.country);
  if (!country) notFound();

  return (
    <>
      <PageHeader
        title={`${country.flag} ${country.name}`}
        subtitle={`Top ${LEADERBOARD_SIZE} in ${country.name}`}
        actions={<CountrySelector value={country.code} />}
      />
      <LeaderboardTable countryCode={country.code} />
    </>
  );
}
