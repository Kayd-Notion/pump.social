'use client';

import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/lib/utils/formatSol';

export interface WalletConnectButtonProps {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * Connect / disconnect control. When connected it shows the username (or a
 * shortened address) and disconnects on click; otherwise it opens the wallet
 * modal. This is the single entry point for wallet connection UI.
 */
export function WalletConnectButton({ size = 'md', fullWidth }: WalletConnectButtonProps) {
  const { connected, connecting, address, username, openConnectModal, disconnect } = useWallet();

  if (connected && address) {
    return (
      <Button variant="secondary" size={size} fullWidth={fullWidth} onClick={disconnect}>
        {username ? `@${username}` : shortenAddress(address)}
      </Button>
    );
  }

  return (
    <Button size={size} fullWidth={fullWidth} loading={connecting} onClick={openConnectModal}>
      Connect wallet
    </Button>
  );
}
