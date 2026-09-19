'use client';

import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';

/**
 * Banner shown only to visitors (no wallet connected). Reading is open to
 * everyone; this nudges users to connect in order to pump, post, comment and
 * follow. Renders nothing once connected.
 */
export function VisitorBanner() {
  const { connected, openConnectModal } = useWallet();

  if (connected) return null;

  return (
    <div className="flex flex-col gap-3 border-b border-neutral-200 bg-accent/5 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">You&apos;re browsing as a visitor</p>
        <p className="text-sm text-neutral-500">
          Connect a wallet to pump posts, publish, comment and follow.
        </p>
      </div>
      <Button size="sm" onClick={openConnectModal} className="shrink-0">
        Connect wallet
      </Button>
    </div>
  );
}
