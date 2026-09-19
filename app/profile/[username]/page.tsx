import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_USERS } from '@/lib/indexer/mock-data';
import { ProfileView } from './ProfileView';

interface Params {
  username: string;
}

/** Pre-render a static page for every known profile (required for export). */
export function generateStaticParams(): Params[] {
  return MOCK_USERS.map((u) => ({ username: u.username }));
}

export const dynamicParams = false;

export default function ProfilePage({ params }: { params: Params }) {
  return (
    <>
      <PageHeader title={`@${params.username}`} />
      <ProfileView username={params.username} />
    </>
  );
}
