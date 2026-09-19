'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { UsernamePicker } from '@/components/profile/UsernamePicker';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { useWallet } from '@/hooks/useWallet';

/**
 * Onboarding — after the first wallet connection, the user picks a pseudo.
 * Redirects to the wallet screen if not connected, and to the new profile
 * once a username is chosen.
 */
export default function OnboardingPage() {
  const { connected, address, username, setUsername } = useWallet();
  const router = useRouter();

  // Already onboarded → straight to the profile.
  useEffect(() => {
    if (connected && username) {
      router.replace(`/profile/${username}`);
    }
  }, [connected, username, router]);

  function handleSubmit(name: string) {
    setUsername(name);
    router.replace(`/profile/${name}`);
  }

  return (
    <>
      <PageHeader title="Welcome" />

      <div className="mx-auto max-w-sm space-y-6 p-6">
        {!connected ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-neutral-500">
              First, connect a wallet. Then choose how you&apos;ll appear on pump.social.
            </p>
            <WalletConnectButton fullWidth size="lg" />
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-semibold">Pick your username</h2>
              <p className="mt-1 text-sm text-neutral-500">
                This is how people will find you — not just your wallet address
                {address ? '.' : '.'}
              </p>
            </div>
            <UsernamePicker onSubmit={handleSubmit} submitLabel="Create my profile" />
          </>
        )}
      </div>
    </>
  );
}
