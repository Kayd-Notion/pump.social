import { VisitorBanner } from '@/components/layout/VisitorBanner';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { Feed } from '@/components/feed/Feed';

/** "Following" feed — posts from accounts the connected user follows. */
export default function FollowingPage() {
  return (
    <>
      <VisitorBanner />
      <FeedTabs />
      <Feed tab="following" />
    </>
  );
}
