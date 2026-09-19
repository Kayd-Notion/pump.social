'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { PostCard } from '@/components/feed/PostCard';
import { search } from '@/lib/indexer/api';
import type { Post, User } from '@/types';

/** Search — live query across posts and users (mock indexer). */
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ posts: Post[]; users: User[] }>({
    posts: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults({ posts: [], users: [] });
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      search(q)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const hasResults = results.posts.length > 0 || results.users.length > 0;

  return (
    <>
      <PageHeader title="Search" />

      <div className="p-4">
        <Input
          autoFocus
          placeholder="Search posts and people"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {!loading && query.trim() && !hasResults && (
        <p className="p-8 text-center text-sm text-neutral-500">No results for “{query}”.</p>
      )}

      {results.users.length > 0 && (
        <section>
          <h2 className="border-b border-neutral-200 px-4 py-2 text-sm font-semibold dark:border-neutral-800">
            People
          </h2>
          <ul>
            {results.users.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <Avatar src={user.avatarUrl} fallback={user.username} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{user.displayName ?? user.username}</p>
                    <p className="text-sm text-neutral-500">@{user.username}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.posts.length > 0 && (
        <section>
          <h2 className="border-b border-neutral-200 px-4 py-2 text-sm font-semibold dark:border-neutral-800">
            Posts
          </h2>
          {results.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </>
  );
}
