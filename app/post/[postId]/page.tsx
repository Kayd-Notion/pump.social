import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_POSTS } from '@/lib/indexer/mock-data';
import { PostDetail } from './PostDetail';

interface Params {
  postId: string;
}

/** Pre-render a static page for every known post (required for export). */
export function generateStaticParams(): Params[] {
  return MOCK_POSTS.map((p) => ({ postId: p.id }));
}

export const dynamicParams = false;

export default function PostPage({ params }: { params: Params }) {
  return (
    <>
      <PageHeader title="Post" />
      <PostDetail postId={params.postId} />
    </>
  );
}
