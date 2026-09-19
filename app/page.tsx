import { VisitorBanner } from '@/components/layout/VisitorBanner';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { Feed } from '@/components/feed/Feed';

/**
 * Home — the "For You" feed. Fully browsable without a wallet; connecting is
 * only required to interact (pump, post, comment, follow).
 */
export default function HomePage() {
  return (
    <>
      <VisitorBanner />
      <FeedTabs />
      <Feed tab="for-you" />
    </>
  );
}
