'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { BalanceDisplay } from '@/components/wallet/BalanceDisplay';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/lib/utils/formatSol';
import { SOLANA_CLUSTER } from '@/lib/config';

/** Wallet overview — connection state, balance and quick actions. */
export default function WalletPage() {
  const { connected, address, username } = useWallet();

  return (
    <>
      <PageHeader title="Wallet" subtitle={`Solana · ${SOLANA_CLUSTER}`} />

      <div className="p-4">
        {!connected ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 p-8 text-center dark:border-neutral-800">
            <p className="text-sm text-neutral-500">
              Connect a Solana wallet to see your balance and pump posts.
            </p>
            <WalletConnectButton />
            <Link href="/wallet/connect" className="text-sm text-accent underline">
              Learn about connecting
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
              <p className="text-sm text-neutral-500">Balance</p>
              <p className="mt-1 text-3xl font-bold">
                <BalanceDisplay />
              </p>
              <p className="mt-3 font-mono text-xs text-neutral-400">
                {address && shortenAddress(address, 8)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {username ? (
                <Link href={`/profile/${username}`}>
                  <Button variant="secondary">My profile</Button>
                </Link>
              ) : (
                <Link href="/onboarding">
                  <Button>Choose a username</Button>
                </Link>
              )}
              <Link href="/profile/settings">
                <Button variant="secondary">Settings</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
