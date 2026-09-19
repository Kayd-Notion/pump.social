'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { Avatar } from '@/components/ui/Avatar';
import { useWallet } from '@/hooks/useWallet';
import { MOCK_USERS } from '@/lib/indexer/mock-data';
import { formatSolWithSymbol } from '@/lib/utils/formatSol';

interface Notification {
  id: string;
  type: 'pump' | 'follow' | 'comment';
  userIndex: number;
  text: string;
  amount?: number;
  age: string;
}

// Mock notifications until the indexer emits real events.
const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'pump', userIndex: 1, text: 'pumped your post', amount: 0.5, age: '2m' },
  { id: 'n2', type: 'follow', userIndex: 2, text: 'followed you', age: '1h' },
  { id: 'n3', type: 'comment', userIndex: 3, text: 'commented on your post', age: '3h' },
  { id: 'n4', type: 'pump', userIndex: 4, text: 'pumped your post', amount: 0.1, age: '6h' },
];

/** Notifications — wallet-gated activity feed (mock data). */
export default function NotificationsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <>
        <PageHeader title="Notifications" />
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <p className="text-sm text-neutral-500">
            Connect a wallet to see who pumped, followed or replied to you.
          </p>
          <WalletConnectButton />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Notifications" />
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {NOTIFICATIONS.map((n) => {
          const user = MOCK_USERS[n.userIndex]!;
          return (
            <li key={n.id} className="flex items-center gap-3 p-4">
              <Avatar src={user.avatarUrl} fallback={user.username} size="sm" />
              <p className="flex-1 text-sm">
                <span className="font-medium">@{user.username}</span> {n.text}
                {n.amount !== undefined && (
                  <span className="font-semibold text-accent"> ({formatSolWithSymbol(n.amount)})</span>
                )}
              </p>
              <span className="text-xs text-neutral-400">{n.age}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
