'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/lib/utils/formatSol';
import { COUNTRIES } from '@/lib/indexer/mock-data';
import type { User } from '@/types';

export interface ProfileHeaderProps {
  user: User;
}

/** Profile identity block: avatar, name, pseudo, bio, and a follow/edit CTA. */
export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { connected, username, openConnectModal } = useWallet();
  const isSelf = connected && username === user.username;
  const country = COUNTRIES.find((c) => c.code === user.countryCode);

  return (
    <header className="p-4">
      <div className="flex items-start justify-between gap-4">
        <Avatar src={user.avatarUrl} fallback={user.username} size="lg" />
        {isSelf ? (
          <Button variant="secondary" size="sm">
            Edit profile
          </Button>
        ) : (
          <Button size="sm" onClick={connected ? undefined : openConnectModal}>
            {connected ? 'Follow' : 'Connect to follow'}
          </Button>
        )}
      </div>

      <div className="mt-3">
        <h1 className="text-xl font-bold">{user.displayName ?? user.username}</h1>
        <p className="text-sm text-neutral-500">
          @{user.username}
          {country && <span className="ml-2">{country.flag}</span>}
        </p>
      </div>

      {user.bio && <p className="mt-3 text-sm text-neutral-800 dark:text-neutral-200">{user.bio}</p>}

      <p className="mt-2 font-mono text-xs text-neutral-400">
        {shortenAddress(user.walletAddress, 6)}
      </p>
    </header>
  );
}
