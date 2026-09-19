'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { UsernamePicker } from '@/components/profile/UsernamePicker';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/lib/utils/formatSol';

/** Profile settings — edit pseudo, view wallet, disconnect. Wallet-gated. */
export default function ProfileSettingsPage() {
  const { connected, address, username, setUsername, disconnect, openConnectModal } = useWallet();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  if (!connected) {
    return (
      <>
        <PageHeader title="Settings" />
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <p className="text-sm text-neutral-500">Connect a wallet to manage your profile.</p>
          <WalletConnectButton />
        </div>
      </>
    );
  }

  function handleSave(name: string) {
    setUsername(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <PageHeader title="Settings" />

      <div className="space-y-6 p-4">
        <section>
          <h2 className="mb-2 text-sm font-semibold">Wallet</h2>
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <span className="font-mono text-sm">{address && shortenAddress(address, 6)}</span>
            <Button variant="danger" size="sm" onClick={() => void disconnect()}>
              Disconnect
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold">Username</h2>
          <UsernamePicker
            initialValue={username ?? ''}
            onSubmit={handleSave}
            submitLabel="Save username"
          />
          {saved && <p className="mt-2 text-sm text-accent">Saved ✓</p>}
        </section>

        {username && (
          <Button variant="secondary" onClick={() => router.push(`/profile/${username}`)}>
            View my profile
          </Button>
        )}
      </div>
    </>
  );
}
