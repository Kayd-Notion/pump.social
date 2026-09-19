'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { PostCard } from '@/components/feed/PostCard';
import { Spinner } from '@/components/ui/Spinner';
import { fetchProfile, fetchProfileStats, fetchUserPosts } from '@/lib/indexer/api';
import type { Post, ProfileStats as Stats, User } from '@/types';

/** Client-side profile view: header, stats and the user's posts. */
export function ProfileView({ username }: { username: string }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [stats, setStats] = useState<Stats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProfile(username).then((u) => {
      if (!cancelled) setUser(u);
    });
    fetchProfileStats(username).then((s) => {
      if (!cancelled) setStats(s);
    });
    fetchUserPosts(username).then((p) => {
      if (!cancelled) setPosts(p);
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (user === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="p-8 text-center text-sm text-neutral-500">
        @{username} not found.{' '}
        <Link href="/" className="text-accent underline">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader user={user} />
      {stats && (
        <div className="border-b border-neutral-200 px-4 pb-4 dark:border-neutral-800">
          <ProfileStats stats={stats} />
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-500">No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
