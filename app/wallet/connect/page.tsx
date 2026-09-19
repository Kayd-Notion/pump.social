'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { useWallet } from '@/hooks/useWallet';

/**
 * Dedicated connect screen. Multi-wallet selection is handled by the wallet
 * adapter modal (Wallet Standard / WalletConnect). Once connected, users
 * without a pseudo are sent to onboarding.
 */
export default function WalletConnectPage() {
  const { connected, needsOnboarding } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected && needsOnboarding) {
      router.replace('/onboarding');
    }
  }, [connected, needsOnboarding, router]);

  return (
    <>
      <PageHeader title="Connect wallet" />

      <div className="mx-auto max-w-sm space-y-6 p-6 text-center">
        <div className="text-5xl">◎</div>
        <div>
          <h2 className="text-lg font-semibold">Connect a Solana wallet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            You can browse pump.social freely. Connect a wallet only when you want to pump posts,
            publish, comment or follow. We support popular wallets and any WalletConnect-compatible
            wallet.
          </p>
        </div>

        <WalletConnectButton fullWidth size="lg" />

        {connected && !needsOnboarding && (
          <p className="text-sm text-accent">You&apos;re connected. Happy pumping!</p>
        )}
      </div>
    </>
  );
}
