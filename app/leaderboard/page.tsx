import { PageHeader } from '@/components/layout/PageHeader';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { CountrySelector } from '@/components/leaderboard/CountrySelector';
import { LEADERBOARD_SIZE } from '@/lib/config';

/** Worldwide leaderboard — top posts by all-time cumulative pump total. */
export default function LeaderboardPage() {
  return (
    <>
      <PageHeader
        title="Leaderboard"
        subtitle={`Top ${LEADERBOARD_SIZE} worldwide`}
        actions={<CountrySelector />}
      />
      <LeaderboardTable />
    </>
  );
}
