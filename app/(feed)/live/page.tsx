import { VisitorBanner } from '@/components/layout/VisitorBanner';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { Feed } from '@/components/feed/Feed';

/** "Live" feed — freshest posts, newest first. */
export default function LivePage() {
  return (
    <>
      <VisitorBanner />
      <FeedTabs />
      <Feed tab="live" />
    </>
  );
}
